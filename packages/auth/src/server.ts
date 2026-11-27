import "server-only";
import { defaultLocale, hasLocale } from "@repo/i18n/config";
import { cookies, headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { cache } from "react";
import { ApiError, callApi, type ForwardedClient, type TokenPair } from "./api";
import {
  type AuthConfig,
  type ClientAuthConfig,
  type ClientUser,
  cookieNames,
  type LoginFormState,
  type StaffAuthConfig,
  type StaffUser,
} from "./config";
import { clearSession, writeSession } from "./session-cookies";

export { ApiError } from "./api";

async function forwardedClient(): Promise<ForwardedClient> {
  const incoming = await headers();
  return {
    ip: incoming.get("x-forwarded-for")?.split(",")[0]?.trim() ?? incoming.get("x-real-ip"),
    userAgent: incoming.get("user-agent"),
  };
}

/**
 * Faz o login na API e grava a sessão em cookies httpOnly. Chame dentro de uma
 * Server Action (é onde o Next permite gravar cookies). Devolve o erro para o formulário.
 */
export async function loginWithPassword(
  config: AuthConfig,
  input: { email: string; password: string; remember: boolean },
): Promise<LoginFormState> {
  const body =
    config.realm === "staff"
      ? { email: input.email, password: input.password, app: config.app, remember: input.remember }
      : { email: input.email, password: input.password, remember: input.remember };

  try {
    const tokens = await callApi<TokenPair>(`/auth/${config.realm}/login`, {
      method: "POST",
      body,
      client: await forwardedClient(),
    });
    writeSession(await cookies(), config, tokens, input.remember);
    return null;
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    const details = error.details as { retryAfterSeconds?: number } | undefined;
    return {
      code: error.code,
      retryAfterSeconds: details?.retryAfterSeconds,
      email: input.email,
      remember: input.remember,
    };
  }
}

/** Encerra a sessão na API (revoga o refresh token) e apaga os cookies. Server Action. */
export async function logout(config: AuthConfig): Promise<void> {
  const jar = await cookies();
  const refreshToken = jar.get(cookieNames(config).refresh)?.value;
  if (refreshToken) {
    await callApi(`/auth/${config.realm}/logout`, {
      method: "POST",
      body: { refreshToken },
    }).catch(() => undefined);
  }
  clearSession(jar, config);
}

/** Access token da requisição atual (já renovado pelo proxy, se precisou). */
async function accessToken(config: AuthConfig) {
  return (await cookies()).get(cookieNames(config).access)?.value;
}

// `cache` do React: várias partes da página pedem o usuário, a API é chamada uma vez.
const loadMe = cache(async (realm: AuthConfig["realm"], token: string) => {
  try {
    return await callApi<StaffUser | ClientUser>(`/auth/${realm}/me`, { token });
  } catch (error) {
    // Token recusado (conta desativada, acesso removido): sem usuário.
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
});

/** Quem está logado neste app da equipe, ou `null`. Só em Server Components (dentro de Suspense). */
export async function getCurrentStaffUser(config: StaffAuthConfig): Promise<StaffUser | null> {
  const token = await accessToken(config);
  return token ? ((await loadMe(config.realm, token)) as StaffUser | null) : null;
}

/** Quem está logado no portal do cliente, ou `null`. */
export async function getCurrentClientUser(config: ClientAuthConfig): Promise<ClientUser | null> {
  const token = await accessToken(config);
  return token ? ((await loadMe(config.realm, token)) as ClientUser | null) : null;
}

/** Chama a API em nome de quem está logado. Lança `ApiError` (401/403/409...). */
export async function callApiAsUser<T>(
  config: AuthConfig,
  path: string,
  options: { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown } = {},
): Promise<T> {
  const token = await accessToken(config);
  if (!token) throw new ApiError(401, "AUTH_TOKEN_MISSING", "No session");
  return callApi<T>(path, { ...options, token });
}

/**
 * Rota `GET /api/session/end?lang=xx`: apaga os cookies e volta ao login. As páginas
 * mandam para cá quando a API recusa o token (Server Components não podem apagar cookies).
 */
export function createSessionEndHandler(config: AuthConfig) {
  return function GET(request: NextRequest) {
    const lang = request.nextUrl.searchParams.get("lang") ?? undefined;
    const locale = hasLocale(lang) ? lang : defaultLocale;
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    clearSession(response.cookies, config);
    return response;
  };
}
