import { PASSWORD_MIN_LENGTH } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { format } from "@repo/i18n/format";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/dashboard/blocks";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { ActionForm } from "@/components/action-form";
import { Badge, inputClass, Notice, PageHeader, Panel } from "@/components/ui";
import { GrantProfileDialog } from "./grant-profile-dialog";
import { PasswordFields } from "./password-fields";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { canCreateUsers } from "@/lib/access";
import { adminApi } from "@/lib/admin-api";
import { formatDateTime, load } from "@/lib/server";
import {
  grantProfileAction,
  revokeProfileAction,
  setUserStatusAction,
  updateUserAction,
} from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).users.title };
}

export default async function UserPage({ params }: PageProps<"/[lang]/users/[id]">) {
  const locale = await getLocale();
  return (
    <div className="max-w-3xl">
      <Suspense fallback={<Skeleton lines={6} label={sharedMessages[locale].shell.loading} />}>
        <UserDetail locale={locale} params={params} />
      </Suspense>
    </div>
  );
}

async function UserDetail({
  locale,
  params,
}: {
  locale: Locale;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await requireUser();
  const dict = await getDictionary();
  const t = dict.users;
  const back = { href: `/${locale}/users`, label: t.title };
  const messages = { errors: dict.errors, permissionLabels: dict.permissions };

  const result = await load(() => adminApi.getUser(id));
  if ("error" in result) {
    return (
      <div className="space-y-6">
        <PageHeader title={t.title} back={back} />
        <Notice>{result.error === "forbidden" ? dict.common.noPermission : t.notFound}</Notice>
      </div>
    );
  }
  const user = result.data;
  const isSelf = actor.id === user.id;

  const profiles = await load(() => adminApi.listProfiles());
  const assigned = new Set(user.profiles.map((profile) => profile.id));
  const available = "data" in profiles ? profiles.data.filter((p) => !assigned.has(p.id)) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={user.name}
        back={back}
        description={
          <div className="flex flex-wrap items-center gap-2">
            <span>{user.email}</span>
            {user.status === "ACTIVE" ? (
              <Badge tone="brand">{t.active}</Badge>
            ) : (
              <Badge tone="danger">{t.disabled}</Badge>
            )}
            {user.invitePending ? <Badge tone="warning">{t.invitePending}</Badge> : null}
          </div>
        }
      />

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">{t.lastLogin}</dt>
          <dd>{formatDateTime(locale, user.lastLoginAt) ?? t.never}</dd>
        </div>
      </dl>

      {isSelf ? (
        <Notice>
          {t.self}{" "}
          <Link href={`/${locale}/preferences`} className="font-medium text-brand-700 hover:underline">
            {t.selfPreferences}
          </Link>
        </Notice>
      ) : null}

      {!isSelf && canCreateUsers(actor) ? (
        <Panel title={t.dataTitle}>
          <ActionForm
            action={updateUserAction}
            hidden={{ lang: locale, userId: user.id }}
            submitLabel={dict.common.save}
            pendingLabel={dict.common.saving}
            successLabel={t.dataSaved}
            messages={messages}
            resetOnSuccess
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 text-sm font-medium">
                <span>{t.name}</span>
                <input
                  name="name"
                  defaultValue={user.name}
                  required
                  maxLength={120}
                  autoComplete="off"
                  className={inputClass}
                />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                <span>{t.email}</span>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  required
                  maxLength={254}
                  autoComplete="off"
                  className={inputClass}
                />
              </label>
            </div>
            <PasswordFields
              minLength={PASSWORD_MIN_LENGTH}
              labels={{
                toggle: t.passwordTitle,
                cancel: t.passwordCancel,
                hint: format(t.passwordHint, { min: PASSWORD_MIN_LENGTH }),
                newPassword: t.newPassword,
                confirm: t.passwordConfirm,
              }}
            />
          </ActionForm>
        </Panel>
      ) : null}

      <Panel title={t.accessTitle}>
        {user.profiles.length === 0 ? (
          <p className="text-sm text-zinc-500">{t.noProfiles}</p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {user.profiles.map((profile) => (
              <li key={profile.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div className="text-sm">
                  <span className="font-medium">{profile.name}</span>{" "}
                  <span className="text-zinc-500">· {dict.common.apps[profile.app]}</span>
                </div>
                {isSelf ? null : (
                  <ActionForm
                    action={revokeProfileAction}
                    hidden={{ lang: locale, userId: user.id, profileId: profile.id }}
                    submitLabel={t.revoke}
                    pendingLabel={t.revoking}
                    variant="small"
                    messages={messages}
                    className="max-w-sm"
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        {isSelf || available.length === 0 ? null : (
          <GrantProfileDialog
            action={grantProfileAction}
            locale={locale}
            userId={user.id}
            profiles={available.map(({ id, app, name, description }) => ({ id, app, name, description }))}
            appNames={dict.common.apps}
            labels={{
              open: t.grant,
              title: t.grantTitle,
              hint: t.grantHint,
              submit: t.grant,
              submitting: t.granting,
              noDescription: t.noDescription,
              close: dict.common.close,
            }}
            messages={messages}
          />
        )}
      </Panel>

      {!isSelf && canCreateUsers(actor) ? (
        <ActionForm
          action={setUserStatusAction}
          hidden={{
            lang: locale,
            userId: user.id,
            action: user.status === "ACTIVE" ? "disable" : "enable",
          }}
          submitLabel={user.status === "ACTIVE" ? t.disable : t.enable}
          pendingLabel={t.updating}
          variant={user.status === "ACTIVE" ? "danger" : "secondary"}
          messages={messages}
        />
      ) : null}
    </div>
  );
}
