import type { StaffApp } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { SectionCard, Skeleton } from "@repo/ui/dashboard/blocks";
import { CircleHelp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { ActionForm } from "@/components/action-form";
import { Badge, buttonClass, inputClass, Notice, PageHeader } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { canCreateUsers } from "@/lib/access";
import { adminApi } from "@/lib/admin-api";
import { load } from "@/lib/server";
import { createUserAction } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).users.new };
}

const APP_ORDER: StaffApp[] = ["ADMIN", "CONSULTOR", "CONTABIL"];

export default async function NewUserPage() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title={dict.users.new}
        description={dict.users.newDescription}
        back={{ href: `/${locale}/users`, label: dict.users.title }}
      />
      <Suspense fallback={<Skeleton lines={6} label={sharedMessages[locale].shell.loading} />}>
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

  const groups = APP_ORDER.map((app) => ({
    app,
    items: profiles.data.filter((profile) => profile.app === app),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <ActionForm
        action={createUserAction}
        hidden={{ lang: locale }}
        submitLabel={t.create}
        pendingLabel={t.creating}
        messages={{ errors: dict.errors, permissionLabels: dict.permissions }}
        className="space-y-5"
        secondaryAction={
          <Link href={`/${locale}/users`} className={buttonClass.secondary}>
            {dict.common.cancel}
          </Link>
        }
      >
        <SectionCard title={t.personTitle} titleId="new-user-person" className="pb-5">
          <div className="mt-1 grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm font-medium text-ink-soft">
              <span>{t.name}</span>
              <input
                name="name"
                required
                maxLength={120}
                autoComplete="off"
                placeholder={t.namePlaceholder}
                className={inputClass}
              />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-ink-soft">
              <span>{t.email}</span>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="off"
                placeholder={t.emailPlaceholder}
                aria-describedby="new-user-email-hint"
                className={inputClass}
              />
              <span id="new-user-email-hint" className="block text-xs font-normal text-ink-faint">
                {t.emailHint}
              </span>
            </label>
          </div>
        </SectionCard>

        <SectionCard
          title={t.initialProfiles}
          titleId="new-user-profiles"
          description={t.profilesHint}
          className="pb-5"
        >
          <fieldset className="mt-1 space-y-5">
            <legend className="sr-only">{t.initialProfiles}</legend>
            {groups.map((group) => (
              <div key={group.app} className="space-y-2">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-faint uppercase">
                  {dict.common.apps[group.app]}
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2 2xl:grid-cols-3">
                  {group.items.map((profile) => (
                    <label
                      key={profile.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white px-3 py-2.5 transition-colors hover:bg-canvas has-checked:border-brand-600 has-checked:bg-brand-50/60"
                    >
                      <input
                        type="checkbox"
                        name="profileIds"
                        value={profile.id}
                        className="mt-0.5 size-4 shrink-0 accent-brand-700"
                      />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-ink">
                          {profile.name}
                          {profile.isSystem ? <Badge tone="brand">{dict.common.system}</Badge> : null}
                        </span>
                        <span className="text-[13px] leading-snug text-ink-muted">
                          {profile.description || t.noDescription}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        </SectionCard>
      </ActionForm>

      <aside className="rounded-xl border border-line bg-white p-5 xl:sticky xl:top-24">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <CircleHelp aria-hidden className="size-4 text-brand-700" />
          {t.howTitle}
        </h2>
        <ol className="mt-4 space-y-4">
          {t.howSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-[13px] leading-relaxed text-ink-muted">
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full bg-[#edf4ef] text-xs font-semibold text-brand-700"
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
