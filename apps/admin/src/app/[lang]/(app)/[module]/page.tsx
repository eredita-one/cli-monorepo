import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { ModulePlaceholder, Skeleton } from "@repo/ui/dashboard/blocks";
import { soonItems } from "@repo/ui/dashboard/menu";
import { buttonClass } from "@repo/ui/dashboard/styles";
import { LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { MENU } from "@/menu";

// Módulos do menu que ainda não têm tela (`soon` em src/menu.ts). Uma pasta com o nome do
// módulo (ex.: `clients/`) tem prioridade sobre esta rota: é só criá-la quando a tela vier.
const MODULES = soonItems(MENU);

export function generateStaticParams() {
  return MODULES.map((item) => ({ module: item.path }));
}

async function findModule(params: Promise<{ module: string }>) {
  const { module: slug } = await params;
  return MODULES.find((item) => item.path === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[module]">): Promise<Metadata> {
  const item = await findModule(params);
  return item ? { title: (await getDictionary()).menu.items[item.id] } : {};
}

export default async function ModulePage({ params }: PageProps<"/[lang]/[module]">) {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Skeleton lines={4} label={sharedMessages[locale].shell.loading} />}>
      <Module locale={locale} params={params} />
    </Suspense>
  );
}

async function Module({ locale, params }: { locale: Locale; params: Promise<{ module: string }> }) {
  const item = await findModule(params);
  if (!item) notFound();
  const dict = await getDictionary();
  const t = sharedMessages[locale].module;
  const Icon = item.icon;

  return (
    <ModulePlaceholder
      icon={<Icon aria-hidden />}
      kicker={`${dict.shell.area} · ${t.kicker}`}
      title={dict.menu.items[item.id]}
      description={dict.modules[item.id]}
      note={t.note}
      action={
        <Link href={`/${locale}`} className={buttonClass("primary")}>
          <LayoutDashboard aria-hidden />
          {t.back}
        </Link>
      }
    />
  );
}
