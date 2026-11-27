import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { AccountMenu, AppShell } from "@repo/ui/app-shell";
import { LanguageSwitcher } from "@repo/ui/language-switcher";
import { NavLink } from "@repo/ui/nav-link";
import { type ReactNode, Suspense } from "react";
import { requireUser } from "@/auth";
import { logoutAction } from "@/auth-actions";
import { AppBrand } from "@/brand";
import { LOCALE_COOKIE } from "@/i18n/config";
import { getLocale } from "@/i18n/get-dictionary";

/**
 * Área logada. O layout em si é estático; o que lê a sessão (conta no cabeçalho) fica
 * dentro de <Suspense>, como o Cache Components exige.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const t = sharedMessages[locale];

  return (
    <AppShell
      brand={<AppBrand />}
      navLabel={t.shell.navigation}
      nav={
        <Suspense fallback={null}>
          <NavLink href={`/${locale}`} exact>
            {t.demo.title}
          </NavLink>
        </Suspense>
      }
      header={
        <>
          {/* Lê o endereço (usePathname): em rotas com [id], só existe na requisição. */}
          <Suspense fallback={null}>
            <LanguageSwitcher cookieName={LOCALE_COOKIE} />
          </Suspense>
          <Suspense fallback={null}>
            <Account locale={locale} />
          </Suspense>
        </>
      }
    >
      {children}
    </AppShell>
  );
}

async function Account({ locale }: { locale: Locale }) {
  const user = await requireUser();
  return (
    <AccountMenu
      name={user.name}
      email={user.email}
      locale={locale}
      logoutAction={logoutAction}
      labels={sharedMessages[locale].shell}
    />
  );
}
