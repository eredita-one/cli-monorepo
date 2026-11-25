// Idiomas suportados por todos os apps do monorepo.
// Seguro para servidor, proxy e Client Components: não importe nada server-only aqui.

export const locales = ["it", "pt", "es", "en"] as const;

export type Locale = (typeof locales)[number];

/** Idioma oficial: usado quando o usuário ainda não escolheu outro. */
export const defaultLocale: Locale = "it";

/** Nome de cada idioma na própria língua, para o seletor de idioma. */
export const localeNames: Record<Locale, string> = {
  it: "Italiano",
  pt: "Português",
  es: "Español",
  en: "English",
};

export function hasLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? "");
}
