import { STAFF_APP_NAMES } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { format } from "@repo/i18n/format";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/app-shell";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { Badge, Notice, Panel } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { canAny, SECTIONS } from "@/lib/access";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).overview.title };
}

/** Primeiro painel após o login: atalhos para o que a pessoa pode gerenciar. */
export default async function OverviewPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Skeleton label={sharedMessages[locale].shell.loading} />}>
      <Overview locale={locale} />
    </Suspense>
  );
}

async function Overview({ locale }: { locale: Locale }) {
  const user = await requireUser();
  const dict = await getDictionary();
  const t = dict.overview;

  const sections = (["users", "profiles", "audit"] as const)
    .filter((section) => canAny(user, SECTIONS[section]))
    .map((section) => ({
      href: `/${locale}/${section}`,
      title: dict.nav[section],
      description: t.sections[section],
    }));

  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {format(t.greeting, { name: user.name })}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t.intro}</p>
      </div>

      {sections.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border border-zinc-200 p-5 transition-colors hover:border-brand-600 dark:border-zinc-800"
            >
              <h2 className="font-semibold group-hover:text-brand-700 dark:group-hover:text-brand-400">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {section.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-brand-700 dark:text-brand-400">
                {t.open} →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <Notice>{t.nothing}</Notice>
      )}

      <Panel>
        <dl className="grid gap-6 text-sm sm:grid-cols-2">
          <div className="space-y-2">
            <dt className="text-zinc-500 dark:text-zinc-400">{t.yourApps}</dt>
            <dd className="flex flex-wrap gap-2">
              {user.apps.map((app) => (
                <Badge key={app} tone={app === user.app ? "brand" : "neutral"}>
                  {STAFF_APP_NAMES[app]}
                </Badge>
              ))}
            </dd>
          </div>
          <div className="space-y-2">
            <dt className="text-zinc-500 dark:text-zinc-400">{t.yourPermissions}</dt>
            <dd className="text-2xl font-semibold">{user.permissions.length}</dd>
          </div>
        </dl>
      </Panel>
    </div>
  );
}
