import type { NextRequest } from "next/server";
import { handleLocaleRouting } from "@repo/i18n/proxy";
import { LOCALE_COOKIE } from "@/i18n/config";

export function proxy(request: NextRequest) {
  return handleLocaleRouting(request, { cookieName: LOCALE_COOKIE });
}

export const config = {
  // O Next exige o matcher escrito aqui (não pode vir de import).
  // Ignora: rotas /api, arquivos internos /_next e arquivos com extensão no
  // último segmento (favicon.ico, imagens do /public etc.).
  matcher: ["/((?!api(?:/|$)|_next/|.*\\.[^/]+$).*)"],
};
