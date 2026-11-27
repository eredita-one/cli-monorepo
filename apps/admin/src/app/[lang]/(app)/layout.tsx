import { otherStaffApps } from "@repo/auth/server";
import { EreditaMark } from "@repo/ui/brand";
import { DashboardFrame } from "@repo/ui/dashboard/frame";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { requireUser } from "@/auth";
import { logoutAction } from "@/auth-actions";
import { AUTH } from "@/auth-config";
import { BRAND_NAME } from "@/brand";
import { LOCALE_COOKIE } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { canAny, SECTIONS } from "@/lib/access";
import { getMenu } from "@/menu";

/**
 * Área logada do admin, no painel padrão (@repo/ui/dashboard). A moldura é estática; menu,
 * conta e contexto dependem da sessão e o DashboardFrame os carrega dentro de <Suspense>.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <DashboardFrame
      locale={locale}
      brand={{ name: "Eredità", product: "ONE", tagline: dict.shell.tagline, mark: <EreditaMark /> }}
      area={dict.shell.area}
      copyright={BRAND_NAME}
      localeCookie={LOCALE_COOKIE}
      logoutAction={logoutAction}
      helpHref={`/${locale}/help`}
      getMenu={() => getMenu(locale)}
      getAccount={async () => {
        const user = await requireUser();
        return {
          name: user.name,
          email: user.email,
          links: canAny(user, SECTIONS.users)
            ? [{ label: dict.account.security, href: `/${locale}/users`, icon: <ShieldCheck aria-hidden /> }]
            : [],
        };
      }}
      getWorkspace={async () => ({
        current: { name: dict.shell.workspace, detail: BRAND_NAME },
        options: otherStaffApps(await requireUser(), AUTH.app, locale),
      })}
    >
      {children}
    </DashboardFrame>
  );
}
