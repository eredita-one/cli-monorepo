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
 * Uso no `src/proxy.ts` do app (o `config.matcher` precisa ficar escrito no app):
 *   export function proxy(request: NextRequest) {
 *     return handleLocaleRouting(request, { cookieName: LOCALE_COOKIE });
 *   }
 */
export function handleLocaleRouting(
  request: NextRequest,
  { cookieName }: { cookieName: string },
) {
  const { pathname } = request.nextUrl;
  if (hasLocale(pathname.split("/")[1])) return NextResponse.next();

  const savedLocale = request.cookies.get(cookieName)?.value;
  const locale = hasLocale(savedLocale) ? savedLocale : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}
