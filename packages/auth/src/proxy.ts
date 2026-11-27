import { NextResponse, type NextRequest } from "next/server";
import { ApiError, callApi, type TokenPair } from "./api";
import { type AuthConfig, cookieNames } from "./config";
import { clearSession, expiresSoon, writeSession } from "./session-cookies";

type Options = {
  /** Caminhos (sem o idioma) que não exigem login. */
  publicPaths?: string[];
};

/**
 * Etapa de autenticação do proxy. Roda depois da de idioma, então a URL já começa com
 * `/{idioma}`. É uma checagem otimista (só cookies, sem banco): quem confere de verdade
 * é a API, em cada chamada.
 *
 *  - Página pública (login): passa.
 *  - Sem sessão: vai para o login.
 *  - Access token vencendo e refresh token presente: renova ANTES de renderizar, grava os
 *    cookies novos na resposta e repassa o token novo à própria requisição (as páginas já
 *    leem o token renovado).
 *  - Renovação recusada (sessão encerrada, conta desativada): apaga a sessão e vai para o login.
 *  - API fora do ar: deixa seguir; a página mostra o erro em vez de deslogar a pessoa.
 */
export async function handleAuthRouting(
  request: NextRequest,
  config: AuthConfig,
  { publicPaths = ["/login"] }: Options = {},
): Promise<NextResponse> {
  const [, locale = "", ...rest] = request.nextUrl.pathname.split("/");
  const path = `/${rest.join("/")}`.replace(/\/+$/, "") || "/";
  if (publicPaths.includes(path)) return NextResponse.next();

  const names = cookieNames(config);
  const access = request.cookies.get(names.access)?.value;
  const refresh = request.cookies.get(names.refresh)?.value;

  if (access && !expiresSoon(access)) return NextResponse.next();
  if (!refresh) return redirectToLogin(request, config, locale);

  let tokens: TokenPair;
  try {
    tokens = await callApi<TokenPair>(`/auth/${config.realm}/refresh`, {
      method: "POST",
      body: { refreshToken: refresh },
      client: {
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        userAgent: request.headers.get("user-agent"),
      },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return redirectToLogin(request, config, locale);
    }
    return NextResponse.next();
  }

  // A própria requisição segue com o token novo; o navegador recebe os cookies novos.
  request.cookies.set(names.access, tokens.accessToken);
  request.cookies.set(names.refresh, tokens.refreshToken);
  const response = NextResponse.next({ request: { headers: request.headers } });
  writeSession(response.cookies, config, tokens, request.cookies.has(names.persist));
  return response;
}

function redirectToLogin(request: NextRequest, config: AuthConfig, locale: string) {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/login`;
  url.search = "";
  const response = NextResponse.redirect(url);
  clearSession(response.cookies, config);
  return response;
}
