import { STAFF_APP_NAMES } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/dashboard/blocks";
import { DemoView } from "@repo/ui/demo-view";
import type { Metadata } from "next";
import { Suspense } from "react";
import { requireUser } from "@/auth";
import { getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  return { title: sharedMessages[await getLocale()].demo.title };
}

/** Página após o login, até o app ganhar conteúdo. */
export default async function HomePage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Skeleton label={sharedMessages[locale].shell.loading} />}>
      <Demo locale={locale} />
    </Suspense>
  );
}

async function Demo({ locale }: { locale: Locale }) {
  const user = await requireUser();
  return (
    <DemoView
      locale={locale}
      user={user}
      areas={user.apps.map((app) => STAFF_APP_NAMES[app])}
    />
  );
}
