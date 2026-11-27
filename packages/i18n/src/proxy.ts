import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "./config";

/**
 * Garante que toda rota tenha o idioma na URL (/it, /pt, /es, /en).
 * URL sem idioma é redirecionada para o idioma salvo no cookie ou, na falta dele,
 * para o idioma oficial (italiano). O idioma do navegador não é considerado.
 *
 * O proxy só LÊ o cookie; quem grava é o seletor de idioma, no clique. Gravar aqui
 * fazia os prefetches dos links do seletor sobrescreverem a escolha do usuário.
 *
 * Devolve o redirecionamento, ou `null` quando a URL já tem idioma (para compor com
 * outras etapas do proxy, como a de autenticação).
 */
export function localeRedirect(
  request: NextRequest,
  { cookieName }: { cookieName: string },
): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (hasLocale(pathname.split("/")[1])) return null;

  const savedLocale = request.cookies.get(cookieName)?.value;
  const locale = hasLocale(savedLocale) ? savedLocale : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

/**
 * Proxy só de idioma, para apps sem login (ex.: landing).
 * Uso no `src/proxy.ts` do app (o `config.matcher` precisa ficar escrito no app):
 *   export function proxy(request: NextRequest) {
 *     return handleLocaleRouting(request, { cookieName: LOCALE_COOKIE });
 *   }
 */
export function handleLocaleRouting(
  request: NextRequest,
  options: { cookieName: string },
) {
  return localeRedirect(request, options) ?? NextResponse.next();
}
