import type { TokenPair } from "./api";
import { type AuthConfig, cookieNames } from "./config";

/** O que `cookies()` (Server Actions) e `response.cookies` (proxy, rotas) têm em comum. */
type CookieWriter = {
  set(
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: "lax";
      path: string;
      maxAge?: number;
      expires?: Date;
    },
  ): unknown;
  delete(name: string): unknown;
};

const baseOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
});

/**
 * Grava a sessão. O access token dura o que a API disser; o refresh token fica até o fim
 * da sessão se a pessoa marcou "Manter conectado" e, sem isso, só até fechar o navegador.
 */
export function writeSession(
  jar: CookieWriter,
  config: AuthConfig,
  tokens: TokenPair,
  persist: boolean,
) {
  const names = cookieNames(config);
  const base = baseOptions();
  const sessionEnd = new Date(tokens.refreshTokenExpiresAt);

  jar.set(names.access, tokens.accessToken, {
    ...base,
    maxAge: tokens.accessTokenExpiresIn,
  });
  jar.set(names.refresh, tokens.refreshToken, {
    ...base,
    ...(persist ? { expires: sessionEnd } : {}),
  });
  if (persist) {
    jar.set(names.persist, "1", { ...base, expires: sessionEnd });
  } else {
    jar.delete(names.persist);
  }
}

export function clearSession(jar: CookieWriter, config: AuthConfig) {
  const names = cookieNames(config);
  jar.delete(names.access);
  jar.delete(names.refresh);
  jar.delete(names.persist);
}

/**
 * O access token vence em menos de `marginSeconds`? Só lê o `exp` (sem conferir a
 * assinatura): serve para decidir quando renovar; quem valida o token é a API.
 */
export function expiresSoon(token: string, marginSeconds = 30): boolean {
  try {
    const payload = token.split(".")[1] ?? "";
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: unknown };
    return typeof exp !== "number" || exp * 1000 <= Date.now() + marginSeconds * 1000;
  } catch {
    return true;
  }
}
