import type { Locale } from "./config";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/**
 * Grava o idioma escolhido pelo usuário. Chame só em resposta a uma ação explícita
 * (ex.: clique no seletor). O cookie é lido por `handleLocaleRouting` no proxy.
 */
export function writeLocaleCookie(cookieName: string, locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${cookieName}=${locale}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax${secure}`;
}
