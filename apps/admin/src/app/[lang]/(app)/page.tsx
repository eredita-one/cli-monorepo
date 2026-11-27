import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/dashboard/blocks";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { PortfolioOverview } from "./_components/portfolio-overview";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).overview.title };
}

/** Visão geral (protótipo "Eredità ONE"): por enquanto com dados fictícios, sinalizados na tela. */
export default async function OverviewPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Skeleton lines={6} label={sharedMessages[locale].shell.loading} />}>
      <Overview />
    </Suspense>
  );
}

async function Overview() {
  // A data do cabeçalho é a do dia da visita, não a do build.
  await connection();
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const today = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeZone: "Europe/Rome",
  }).format(new Date());

  return <PortfolioOverview locale={locale} today={today} t={dict.overview} />;
}
