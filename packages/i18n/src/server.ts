import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";

/**
 * Cria `getLocale()` e `getDictionary()` de um app. Só funcionam em Server Components.
 *
 * - `rootLocale`: o getter de `next/root-params` do segmento de idioma (ex.: `lang`).
 *   É passado pelo app porque os tipos de `next/root-params` são gerados por app.
 * - `dictionaries`: um carregador por idioma. Com `createDictionaryLoader<Dictionary>`,
 *   o TypeScript acusa qualquer chave faltando em um idioma.
 */
export function createDictionaryLoader<TDictionary>({
  rootLocale,
  dictionaries,
}: {
  rootLocale: () => Promise<string>;
  dictionaries: Record<Locale, () => Promise<TDictionary>>;
}) {
  async function getLocale(): Promise<Locale> {
    const locale = await rootLocale();
    if (!hasLocale(locale)) notFound();
    return locale;
  }

  async function getDictionary(): Promise<TDictionary> {
    return dictionaries[await getLocale()]();
  }

  return { getLocale, getDictionary };
}
