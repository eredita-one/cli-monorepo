import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { CircleHelp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { type AccountLink, AccountMenu } from "./account-menu";
import { initialsOf } from "./blocks";
import { Breadcrumbs } from "./breadcrumbs";
import type { NavGroup } from "./menu";
import { MenuSearch } from "./menu-search";
import { type DashboardNotification, NotificationsButton } from "./notifications";
import { DashboardShell, type ShellBrand } from "./shell";
import { SidebarNav } from "./sidebar-nav";
import { topbarIconButton } from "./styles";
import { type Workspace, WorkspaceSwitcher } from "./workspace-switcher";

export type DashboardAccount = {
  name: string;
  email: string;
  /** Linha de baixo do nome no cabeçalho (sem ela, o e-mail). */
  subtitle?: string;
  /** Atalhos no menu da conta. */
  links?: AccountLink[];
};

type SessionLoader<T> = () => Promise<T>;

/**
 * Painel padrão de todos os apps logados (Server Component). O app passa a marca, os
 * textos e funções que leem a sessão (menu, conta, contexto); elas rodam dentro de
 * <Suspense>, então a moldura sai pronta no HTML estático e só essas partes esperam a API.
 *
 * ```tsx
 * <DashboardFrame locale={locale} brand={...} area="Administração" getMenu={() => getMenu(locale)} ...>
 *   {children}
 * </DashboardFrame>
 * ```
 */
export function DashboardFrame({
  locale,
  brand,
  area,
  copyright,
  localeCookie,
  logoutAction,
  helpHref,
  getMenu,
  getAccount,
  getWorkspace,
  getNotifications,
  children,
}: {
  locale: Locale;
  brand: ShellBrand;
  /** Nome da área no começo da trilha (ex.: "Administração"). */
  area: string;
  /** Texto do rodapé depois do © (normalmente a marca). */
  copyright: string;
  /** Cookie de idioma do app (a troca de idioma fica no menu da conta). */
  localeCookie: string;
  logoutAction: (formData: FormData) => Promise<void>;
  /** Página de ajuda. Sem ela, o cartão e o botão de ajuda não aparecem. */
  helpHref?: string;
  /** Menu já filtrado para quem está logado (use `resolveMenu`). */
  getMenu: SessionLoader<NavGroup[]>;
  getAccount: SessionLoader<DashboardAccount>;
  /** Contexto de trabalho no topo da barra lateral. Sem ele, o bloco não aparece. */
  getWorkspace?: SessionLoader<Workspace>;
  getNotifications?: SessionLoader<DashboardNotification[]>;
  children: ReactNode;
}) {
  const t = sharedMessages[locale].shell;

  return (
    <DashboardShell
      brand={brand}
      labels={t}
      help={
        helpHref
          ? { href: helpHref, title: t.helpTitle, body: t.helpBody, cta: t.helpCta }
          : undefined
      }
      workspace={
        getWorkspace ? (
          <Suspense fallback={<WorkspaceFallback caption={t.workspace} />}>
            <SessionWorkspace load={getWorkspace} labels={{ caption: t.workspace, switchTo: t.switchWorkspace }} />
          </Suspense>
        ) : undefined
      }
      nav={
        <Suspense fallback={<NavFallback label={t.loading} />}>
          <SessionNav load={getMenu} label={t.navigation} />
        </Suspense>
      }
      topbarStart={
        // Lê o endereço (usePathname): em rotas com [id], só existe na requisição.
        <Suspense fallback={<span className="truncate text-[13px] text-ink-muted">{area}</span>}>
          <SessionBreadcrumbs load={getMenu} root={area} label={t.breadcrumbs} />
        </Suspense>
      }
      topbarEnd={
        <>
          <Suspense fallback={<SearchFallback placeholder={t.searchPlaceholder} />}>
            <SessionSearch
              load={getMenu}
              labels={{ label: t.search, placeholder: t.searchPlaceholder, empty: t.searchEmpty }}
            />
          </Suspense>
          <Suspense fallback={<NotificationsButton items={[]} labels={{ title: t.notifications, empty: t.notificationsEmpty }} />}>
            <SessionNotifications
              load={getNotifications}
              labels={{ title: t.notifications, empty: t.notificationsEmpty }}
            />
          </Suspense>
          {helpHref ? (
            <Link href={helpHref} aria-label={t.help} title={t.help} className={`${topbarIconButton} max-md:hidden`}>
              <CircleHelp aria-hidden className="size-[18px]" />
            </Link>
          ) : null}
          <Suspense fallback={<span className="size-8 animate-pulse rounded-full bg-line" />}>
            <SessionAccount
              load={getAccount}
              locale={locale}
              localeCookie={localeCookie}
              logoutAction={logoutAction}
              labels={{
                account: t.account,
                language: sharedMessages[locale].language,
                chooseLanguage: t.chooseLanguage,
                close: t.close,
                logout: t.logout,
                loggingOut: t.loggingOut,
              }}
            />
          </Suspense>
        </>
      }
      footer={
        <footer className="mt-6 flex flex-col gap-1.5 border-t border-line pt-3 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {copyright}</span>
          <span className="inline-flex items-center gap-1.5">
            {t.footerNote}
            <ShieldCheck aria-hidden className="size-3.5 text-brand-600" />
          </span>
        </footer>
      }
    >
      {children}
    </DashboardShell>
  );
}

// Peças que leem a sessão. Cada uma chama o seu loader; o `cache` do React nas funções de
// sessão faz a API ser chamada uma vez por requisição.

async function SessionNav({ load, label }: { load: SessionLoader<NavGroup[]>; label: string }) {
  return <SidebarNav groups={await load()} label={label} />;
}

async function SessionBreadcrumbs({
  load,
  root,
  label,
}: {
  load: SessionLoader<NavGroup[]>;
  root: string;
  label: string;
}) {
  return <Breadcrumbs groups={await load()} root={root} label={label} />;
}

async function SessionSearch({
  load,
  labels,
}: {
  load: SessionLoader<NavGroup[]>;
  labels: { label: string; placeholder: string; empty: string };
}) {
  return <MenuSearch groups={await load()} labels={labels} />;
}

async function SessionNotifications({
  load,
  labels,
}: {
  load?: SessionLoader<DashboardNotification[]>;
  labels: { title: string; empty: string };
}) {
  return <NotificationsButton items={load ? await load() : []} labels={labels} />;
}

async function SessionWorkspace({
  load,
  labels,
}: {
  load: SessionLoader<Workspace>;
  labels: { caption: string; switchTo: string };
}) {
  return <WorkspaceSwitcher workspace={await load()} labels={labels} />;
}

async function SessionAccount({
  load,
  ...props
}: {
  load: SessionLoader<DashboardAccount>;
  locale: Locale;
  localeCookie: string;
  logoutAction: (formData: FormData) => Promise<void>;
  labels: {
    account: string;
    language: string;
    chooseLanguage: string;
    close: string;
    logout: string;
    loggingOut: string;
  };
}) {
  const account = await load();
  return (
    <AccountMenu
      {...props}
      name={account.name}
      email={account.email}
      subtitle={account.subtitle}
      initials={initialsOf(account.name)}
      links={account.links ?? []}
    />
  );
}

function NavFallback({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="flex animate-pulse flex-col gap-2 px-1 pt-2">
      {[70, 85, 60, 75, 55, 80].map((width, index) => (
        <span key={index} className="h-7 rounded-md bg-white/8" style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}

function WorkspaceFallback({ caption }: { caption: string }) {
  return (
    <div>
      <span className="block px-2 pb-2 text-[10px] font-semibold tracking-[0.13em] text-white/45 uppercase">
        {caption}
      </span>
      <span className="block h-12 animate-pulse rounded-lg border border-white/15 bg-white/5" />
    </div>
  );
}

function SearchFallback({ placeholder }: { placeholder: string }) {
  return (
    <span className="flex h-9 w-[clamp(12rem,22vw,18rem)] items-center rounded-lg border border-line bg-[#fbfcfb] px-9 text-[13px] text-ink-faint max-sm:hidden">
      {placeholder}
    </span>
  );
}
