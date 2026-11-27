import type { Locale } from "@repo/i18n/config";
import { format } from "@repo/i18n/format";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/dashboard/blocks";
import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { ActionForm } from "@/components/action-form";
import { Badge, Notice, PageHeader, Panel } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { definableApps } from "@/lib/access";
import { adminApi } from "@/lib/admin-api";
import { load } from "@/lib/server";
import { deleteProfileAction, updateProfileAction } from "../actions";
import { buildCatalog, profileFormLabels } from "../catalog";
import { ProfileForm } from "../profile-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).profiles.editTitle };
}

export default async function ProfilePage({ params }: PageProps<"/[lang]/profiles/[id]">) {
  const locale = await getLocale();
  return (
    <div className="max-w-4xl">
      <Suspense fallback={<Skeleton lines={6} label={sharedMessages[locale].shell.loading} />}>
        <ProfileDetail locale={locale} params={params} />
      </Suspense>
    </div>
  );
}

async function ProfileDetail({
  locale,
  params,
}: {
  locale: Locale;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await requireUser();
  const dict = await getDictionary();
  const t = dict.profiles;
  const back = { href: `/${locale}/profiles`, label: t.title };
  const messages = { errors: dict.errors, permissionLabels: dict.permissions };

  // A API não tem GET por id: a lista já traz tudo (inclusive quantos usuários têm o perfil).
  const [profiles, permissions] = await Promise.all([
    load(() => adminApi.listProfiles()),
    load(() => adminApi.listPermissions()),
  ]);
  if ("error" in profiles || "error" in permissions) {
    return (
      <div className="space-y-6">
        <PageHeader title={t.editTitle} back={back} />
        <Notice>{dict.common.noPermission}</Notice>
      </div>
    );
  }
  const profile = profiles.data.find((p) => p.id === id);
  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader title={t.editTitle} back={back} />
        <Notice>{t.notFound}</Notice>
      </div>
    );
  }

  const catalog = buildCatalog(permissions.data, dict);
  const editable = !profile.isSystem && definableApps(actor).includes(profile.app);

  return (
    <div className="space-y-6">
      <PageHeader
        title={profile.name}
        back={back}
        description={
          <div className="flex flex-wrap items-center gap-2">
            <span>{dict.common.apps[profile.app]}</span>
            {profile.isSystem ? <Badge tone="brand">{t.system}</Badge> : null}
            <span>
              · {t.users}: {profile.userCount}
            </span>
          </div>
        }
      />

      {editable ? (
        <Panel>
          <ProfileForm
            action={updateProfileAction}
            locale={locale}
            apps={[profile.app]}
            catalog={catalog}
            initial={{
              id: profile.id,
              app: profile.app,
              name: profile.name,
              description: profile.description ?? "",
              permissions: profile.permissions,
            }}
            labels={{
              ...profileFormLabels(dict),
              submit: dict.common.save,
              pending: dict.common.saving,
              saved: dict.common.saved,
            }}
            messages={messages}
          />
        </Panel>
      ) : (
        <ReadOnlyPermissions
          note={profile.isSystem ? t.systemNote : dict.common.noPermission}
          permissions={profile.permissions}
          labels={catalog}
        />
      )}

      {editable && profile.userCount === 0 ? (
        <ActionForm
          action={deleteProfileAction}
          hidden={{ lang: locale, id: profile.id }}
          submitLabel={t.delete}
          pendingLabel={t.deleting}
          variant="danger"
          messages={messages}
        />
      ) : null}
      {editable && profile.userCount > 0 ? (
        <Notice>{format(t.inUse, { count: profile.userCount })}</Notice>
      ) : null}
    </div>
  );
}

function ReadOnlyPermissions({
  note,
  permissions,
  labels,
}: {
  note: string;
  permissions: string[];
  labels: { key: string; label: string }[];
}) {
  const labelOf = new Map(labels.map((item) => [item.key, item.label]));
  return (
    <Panel>
      <Notice>{note}</Notice>
      <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        {permissions.map((key) => (
          <li key={key}>✓ {labelOf.get(key) ?? key}</li>
        ))}
      </ul>
    </Panel>
  );
}
