import Link from "next/link";
import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";

/** Página 404 traduzida. Use no `[lang]/not-found.tsx` de cada app. */
export function NotFoundView({ locale }: { locale: Locale }) {
  const t = sharedMessages[locale].notFound;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
        {t.description}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-8 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        {t.backHome}
      </Link>
    </main>
  );
}
