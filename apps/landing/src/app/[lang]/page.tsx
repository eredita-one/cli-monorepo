import { Brand } from "@repo/ui/brand";
import { LanguageSwitcher } from "@repo/ui/language-switcher";
import { LOCALE_COOKIE } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

// Página provisória: substitua pelo conteúdo real da landing.
export default async function HomePage() {
  const dict = await getDictionary();
  const t = dict.home;

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-8">
        <Brand />
        <LanguageSwitcher cookieName={LOCALE_COOKIE} />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16 sm:px-8">
        <h1 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          {t.heading}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          {t.subheading}
        </p>
      </main>
    </div>
  );
}
