import { handleAuthRouting } from "@repo/auth/proxy";
import { localeRedirect } from "@repo/i18n/proxy";
import type { NextRequest } from "next/server";
import { AUTH } from "@/auth-config";
import { LOCALE_COOKIE } from "@/i18n/config";

/** 1) idioma na URL; 2) sessão (renova o token ou manda para o login). */
export async function proxy(request: NextRequest) {
  return (
    localeRedirect(request, { cookieName: LOCALE_COOKIE }) ??
    (await handleAuthRouting(request, AUTH))
  );
}

export const config = {
  // O Next exige o matcher escrito aqui (não pode vir de import).
  // Ignora: rotas /api, arquivos internos /_next e arquivos com extensão no
  // último segmento (favicon.ico, imagens do /public etc.).
  matcher: ["/((?!api(?:/|$)|_next/|.*\\.[^/]+$).*)"],
};
