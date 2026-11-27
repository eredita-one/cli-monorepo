import type { StaffApp } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/dashboard/blocks";
import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { ActionForm } from "@/components/action-form";
import { inputClass, Notice, PageHeader, Panel } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { canCreateUsers } from "@/lib/access";
import { adminApi } from "@/lib/admin-api";
import { load } from "@/lib/server";
import { createUserAction } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).users.new };
}

export default async function NewUserPage() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={dict.users.new}
        back={{ href: `/${locale}/users`, label: dict.users.title }}
      />
      <Suspense fallback={<Skeleton lines={4} label={sharedMessages[locale].shell.loading} />}>
        <NewUserForm locale={locale} />
      </Suspense>
    </div>
  );
}

async function NewUserForm({ locale }: { locale: Locale }) {
  const user = await requireUser();
  const dict = await getDictionary();
  const t = dict.users;
  if (!canCreateUsers(user)) return <Notice>{dict.common.noPermission}</Notice>;

  const profiles = await load(() => adminApi.listProfiles());
  if ("error" in profiles) return <Notice>{dict.common.noPermission}</Notice>;

  const byApp = Object.groupBy(profiles.data, (profile) => profile.app);

  return (
    <Panel>
      <div className="space-y-5">
        <Notice>{t.createHint}</Notice>
        <ActionForm
          action={createUserAction}
          hidden={{ lang: locale }}
          submitLabel={t.create}
          pendingLabel={t.creating}
          messages={{ errors: dict.errors, permissionLabels: dict.permissions }}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              <span>{t.name}</span>
              <input name="name" required maxLength={120} className={inputClass} />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              <span>{t.email}</span>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="off"
                className={inputClass}
              />
            </label>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{t.initialProfiles}</legend>
            {(Object.keys(byApp) as StaffApp[]).map((app) => (
              <div key={app} className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {dict.common.apps[app]}
                </p>
                {byApp[app]?.map((profile) => (
                  <label key={profile.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="profileIds"
                      value={profile.id}
                      className="size-4 accent-brand-700"
                    />
                    {profile.name}
                  </label>
                ))}
              </div>
            ))}
          </fieldset>
        </ActionForm>
      </div>
    </Panel>
  );
}
