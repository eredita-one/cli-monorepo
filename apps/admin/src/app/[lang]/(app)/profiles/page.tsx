import type { StaffApp } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/app-shell";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { Badge, buttonClass, Notice, PageHeader, tableClass } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { definableApps } from "@/lib/access";
import { adminApi } from "@/lib/admin-api";
import { load } from "@/lib/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).profiles.title };
}

export default async function ProfilesPage() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.profiles.title}
        actions={
          <Suspense fallback={null}>
            <NewProfileButton locale={locale} label={dict.profiles.new} />
          </Suspense>
        }
      />
      <Suspense fallback={<Skeleton lines={5} label={sharedMessages[locale].shell.loading} />}>
        <ProfilesByApp locale={locale} />
      </Suspense>
    </div>
  );
}

async function NewProfileButton({ locale, label }: { locale: Locale; label: string }) {
  const user = await requireUser();
  if (definableApps(user).length === 0) return null;
  return (
    <Link href={`/${locale}/profiles/new`} className={buttonClass.primary}>
      {label}
    </Link>
  );
}

const APP_ORDER: StaffApp[] = ["ADMIN", "CONSULTOR", "CONTABIL"];

async function ProfilesByApp({ locale }: { locale: Locale }) {
  const dict = await getDictionary();
  const t = dict.profiles;
  const result = await load(() => adminApi.listProfiles());
  if ("error" in result) return <Notice>{dict.common.noPermission}</Notice>;
  if (result.data.length === 0) return <Notice>{t.empty}</Notice>;

  const byApp = Object.groupBy(result.data, (profile) => profile.app);

  return (
    <div className="space-y-8">
      {APP_ORDER.filter((app) => byApp[app]?.length).map((app) => (
        <section key={app} className="space-y-3">
          <h2 className="text-base font-semibold">{dict.common.apps[app]}</h2>
          <div className={tableClass.wrapper}>
            <table className={tableClass.table}>
              <thead className={tableClass.head}>
                <tr>
                  <th className={tableClass.th}>{t.name}</th>
                  <th className={`${tableClass.th} w-32 text-right`}>{t.permissions}</th>
                  <th className={`${tableClass.th} w-28 text-right`}>{t.users}</th>
                </tr>
              </thead>
              <tbody>
                {byApp[app]?.map((profile) => (
                  <tr key={profile.id} className={tableClass.row}>
                    <td className={tableClass.td}>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/${locale}/profiles/${profile.id}`}
                          className="font-medium text-brand-700 hover:underline dark:text-brand-400"
                        >
                          {profile.name}
                        </Link>
                        {profile.isSystem ? <Badge tone="brand">{t.system}</Badge> : null}
                      </div>
                      {profile.description ? (
                        <div className="text-zinc-500 dark:text-zinc-400">
                          {profile.description}
                        </div>
                      ) : null}
                    </td>
                    <td className={`${tableClass.td} text-right tabular-nums`}>
                      {profile.permissions.length}
                    </td>
                    <td className={`${tableClass.td} text-right tabular-nums`}>
                      {profile.userCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
