import type { Metadata } from "next";
import { Brand, BRAND_NAME } from "@repo/ui/brand";
import { LanguageSwitcher } from "@repo/ui/language-switcher";
import { LOCALE_COOKIE } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { LoginForm } from "./_components/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.login.title };
}

export default async function LoginPage() {
  const dict = await getDictionary();
  const t = dict.login;

  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-emerald-950 p-12 text-emerald-50 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-emerald-500/20 blur-3xl"
        />
        <Brand />
        <div className="relative max-w-md space-y-4">
          <p className="text-3xl leading-tight font-semibold tracking-tight">
            {t.tagline}
          </p>
          <p className="text-emerald-200/80">{t.description}</p>
        </div>
        <p className="relative text-sm text-emerald-300/70">
          {BRAND_NAME} · {t.footer}
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Brand className="mb-10 lg:hidden" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.heading}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {t.subheading}
          </p>
          <LoginForm labels={t.form} />
          <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <LanguageSwitcher cookieName={LOCALE_COOKIE} />
          </div>
        </div>
      </main>
    </div>
  );
}
