import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/dashboard/blocks";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { Badge, buttonClass, Notice, PageHeader, tableClass } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { canCreateUsers } from "@/lib/access";
import { adminApi } from "@/lib/admin-api";
import { formatDateTime, load } from "@/lib/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).users.title };
}

export default async function UsersPage() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <div className="space-y-6">
      <PageHeader
        title={dict.users.title}
        actions={
          <Suspense fallback={null}>
            <NewUserButton locale={locale} label={dict.users.new} />
          </Suspense>
        }
      />
      <Suspense fallback={<Skeleton lines={5} label={sharedMessages[locale].shell.loading} />}>
        <UsersTable locale={locale} />
      </Suspense>
    </div>
  );
}

async function NewUserButton({ locale, label }: { locale: Locale; label: string }) {
  const user = await requireUser();
  if (!canCreateUsers(user)) return null;
  return (
    <Link href={`/${locale}/users/new`} className={buttonClass.primary}>
      {label}
    </Link>
  );
}

async function UsersTable({ locale }: { locale: Locale }) {
  const dict = await getDictionary();
  const t = dict.users;
  const result = await load(() => adminApi.listUsers());
  if ("error" in result) return <Notice>{dict.common.noPermission}</Notice>;
  if (result.data.length === 0) return <Notice>{t.empty}</Notice>;

  return (
    <div className={tableClass.wrapper}>
      <table className={tableClass.table}>
        <thead className={tableClass.head}>
          <tr>
            <th className={tableClass.th}>{t.name}</th>
            <th className={tableClass.th}>{t.status}</th>
            <th className={tableClass.th}>{t.profiles}</th>
            <th className={tableClass.th}>{t.lastLogin}</th>
          </tr>
        </thead>
        <tbody>
          {result.data.map((user) => (
            <tr key={user.id} className={tableClass.row}>
              <td className={tableClass.td}>
                <Link
                  href={`/${locale}/users/${user.id}`}
                  className="font-medium text-brand-700 hover:underline dark:text-brand-400"
                >
                  {user.name}
                </Link>
                <div className="text-zinc-500 dark:text-zinc-400">{user.email}</div>
              </td>
              <td className={tableClass.td}>
                <div className="flex flex-wrap gap-1.5">
                  {user.status === "ACTIVE" ? (
                    <Badge tone="brand">{t.active}</Badge>
                  ) : (
                    <Badge tone="danger">{t.disabled}</Badge>
                  )}
                  {user.invitePending ? <Badge tone="warning">{t.invitePending}</Badge> : null}
                </div>
              </td>
              <td className={tableClass.td}>
                <div className="flex flex-wrap gap-1.5">
                  {user.profiles.map((profile) => (
                    <Badge key={profile.id}>
                      {dict.common.apps[profile.app]} · {profile.name}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className={`${tableClass.td} whitespace-nowrap text-zinc-600 dark:text-zinc-400`}>
                {formatDateTime(locale, user.lastLoginAt) ?? t.never}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
