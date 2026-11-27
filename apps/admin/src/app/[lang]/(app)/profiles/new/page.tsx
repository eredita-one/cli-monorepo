import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/app-shell";
import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { Notice, PageHeader, Panel } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { definableApps } from "@/lib/access";
import { adminApi } from "@/lib/admin-api";
import { load } from "@/lib/server";
import { createProfileAction } from "../actions";
import { buildCatalog, profileFormLabels } from "../catalog";
import { ProfileForm } from "../profile-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).profiles.new };
}

export default async function NewProfilePage() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title={dict.profiles.new}
        back={{ href: `/${locale}/profiles`, label: dict.profiles.title }}
      />
      <Suspense fallback={<Skeleton lines={6} label={sharedMessages[locale].shell.loading} />}>
        <NewProfile locale={locale} />
      </Suspense>
    </div>
  );
}

async function NewProfile({ locale }: { locale: Locale }) {
  const user = await requireUser();
  const dict = await getDictionary();
  const apps = definableApps(user);
  if (apps.length === 0) return <Notice>{dict.common.noPermission}</Notice>;

  const permissions = await load(() => adminApi.listPermissions());
  if ("error" in permissions) return <Notice>{dict.common.noPermission}</Notice>;

  return (
    <Panel>
      <ProfileForm
        action={createProfileAction}
        locale={locale}
        apps={apps}
        catalog={buildCatalog(permissions.data, dict)}
        initial={{ app: apps[0]!, name: "", description: "", permissions: [] }}
        labels={{
          ...profileFormLabels(dict),
          submit: dict.profiles.create,
          pending: dict.profiles.creating,
        }}
        messages={{ errors: dict.errors, permissionLabels: dict.permissions }}
      />
    </Panel>
  );
}
