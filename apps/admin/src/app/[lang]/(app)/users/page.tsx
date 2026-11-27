import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { PageHeading, Skeleton } from "@repo/ui/dashboard/blocks";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { buttonClass, Notice } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { canCreateUsers } from "@/lib/access";
import { adminApi } from "@/lib/admin-api";
import { formatDateTime, load } from "@/lib/server";
import { UsersBrowser } from "./users-browser";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).users.title };
}

export default async function UsersPage() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <div>
      <PageHeading
        kicker={dict.shell.area}
        title={dict.menu.items.users}
        description={dict.users.pageDescription}
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
    <UsersBrowser
      locale={locale}
      users={result.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        invitePending: user.invitePending,
        profiles: user.profiles,
        lastLoginAt: user.lastLoginAt,
        lastLogin: formatDateTime(locale, user.lastLoginAt) ?? t.never,
      }))}
      appNames={dict.common.apps}
      labels={{
        user: t.user,
        status: t.status,
        profiles: t.profiles,
        lastLogin: t.lastLogin,
        actions: t.actions,
        active: t.active,
        disabled: t.disabled,
        invitePending: t.invitePending,
        search: t.search,
        searchPlaceholder: t.searchPlaceholder,
        filters: t.filters,
        sort: t.sort,
        sortRecent: t.sortRecent,
        sortOldest: t.sortOldest,
        allStatuses: t.allStatuses,
        area: t.area,
        allAreas: t.allAreas,
        noArea: t.noArea,
        profile: t.profileFilter,
        allProfiles: t.allProfiles,
        clearFilters: t.clearFilters,
        showing: t.showing,
        page: t.page,
        previous: t.previous,
        next: t.next,
        noMatch: t.noMatch,
        noMatchHint: t.noMatchHint,
        openUser: t.openUser,
      }}
    />
  );
}
