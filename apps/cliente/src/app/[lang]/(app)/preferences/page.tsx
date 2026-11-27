import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/dashboard/blocks";
import { PreferencesView } from "@repo/ui/preferences";
import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { changePasswordAction } from "@/auth-actions";
import { LOCALE_COOKIE } from "@/i18n/config";
import { getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  return { title: sharedMessages[await getLocale()].preferences.title };
}

/** Preferências do cliente: os próprios dados e a troca da senha. */
export default async function PreferencesPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Skeleton lines={6} label={sharedMessages[locale].shell.loading} />}>
      <Preferences locale={locale} />
    </Suspense>
  );
}

async function Preferences({ locale }: { locale: Locale }) {
  const user = await requireUser();
  return (
    <PreferencesView
      locale={locale}
      localeCookie={LOCALE_COOKIE}
      account={{ name: user.name, email: user.email }}
      changePasswordAction={changePasswordAction}
    />
  );
}
