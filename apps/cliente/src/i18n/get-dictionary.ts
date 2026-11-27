import { lang } from "next/root-params";
import { createDictionaryLoader } from "@repo/i18n/server";
import type { Dictionary } from "./types";

/** Idioma e dicionário da rota atual. Só funcionam em Server Components. */
export const { getLocale, getDictionary } = createDictionaryLoader<Dictionary>({
  rootLocale: lang,
  dictionaries: {
    it: () => import("./dictionaries/it.json").then((module) => module.default),
    pt: () => import("./dictionaries/pt.json").then((module) => module.default),
    es: () => import("./dictionaries/es.json").then((module) => module.default),
    en: () => import("./dictionaries/en.json").then((module) => module.default),
  },
});
