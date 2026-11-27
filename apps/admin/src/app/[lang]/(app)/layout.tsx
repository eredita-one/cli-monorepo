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
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { canAny, SECTIONS } from "@/lib/access";

/**
 * Área logada do admin. O layout é estático; navegação e conta dependem da sessão e
 * ficam dentro de <Suspense> (exigência do Cache Components).
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const shared = sharedMessages[locale];

  return (
    <AppShell
      brand={<AppBrand />}
      navLabel={shared.shell.navigation}
      nav={
        <Suspense fallback={null}>
          <AdminNav locale={locale} />
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

/** Só as seções que as permissões da pessoa abrem (a API confere de novo em cada chamada). */
async function AdminNav({ locale }: { locale: Locale }) {
  const user = await requireUser();
  const t = (await getDictionary()).nav;
  const items = [
    { href: `/${locale}`, label: t.overview, exact: true, show: true },
    { href: `/${locale}/users`, label: t.users, show: canAny(user, SECTIONS.users) },
    { href: `/${locale}/profiles`, label: t.profiles, show: canAny(user, SECTIONS.profiles) },
    { href: `/${locale}/audit`, label: t.audit, show: canAny(user, SECTIONS.audit) },
  ];

  return items
    .filter((item) => item.show)
    .map((item) => (
      <NavLink key={item.href} href={item.href} exact={item.exact}>
        {item.label}
      </NavLink>
    ));
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
