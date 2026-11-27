"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { writeLocaleCookie } from "@repo/i18n/client";
import {
  defaultLocale,
  hasLocale,
  localeNames,
  locales,
} from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";

/**
 * Troca o idioma mantendo o usuário na mesma página.
 * Grava a escolha no cookie do app só no clique: é a única escolha explícita.
 */
export function LanguageSwitcher({ cookieName }: { cookieName: string }) {
  const pathname = usePathname();
  // pathname = "/<idioma>/resto/da/rota"
  const [, segment, ...rest] = pathname.split("/");
  const currentLocale = hasLocale(segment) ? segment : defaultLocale;
  const restPath = rest.length > 0 ? `/${rest.join("/")}` : "";

  return (
    <nav aria-label={sharedMessages[currentLocale].language}>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {locales.map((locale) => {
          const isCurrent = locale === currentLocale;
          return (
            <li key={locale}>
              <Link
                href={`/${locale}${restPath}`}
                hrefLang={locale}
                lang={locale}
                aria-current={isCurrent ? "true" : undefined}
                onClick={() => writeLocaleCookie(cookieName, locale)}
                className={
                  isCurrent
                    ? "font-semibold text-brand-700 dark:text-brand-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }
              >
                {localeNames[locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
