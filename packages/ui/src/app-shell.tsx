import type { ReactNode } from "react";
import { LogoutButton } from "./logout-button";

/**
 * Moldura das áreas logadas: barra lateral com a marca e a navegação (no celular, vira
 * uma faixa no topo), cabeçalho com a conta e o conteúdo. Server Component: as partes
 * que dependem da sessão chegam prontas (normalmente dentro de <Suspense>).
 */
export function AppShell({
  brand,
  nav,
  navLabel,
  header,
  children,
}: {
  brand: ReactNode;
  nav: ReactNode;
  navLabel: string;
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <aside className="flex flex-col bg-brand-950 text-brand-50 lg:w-64 lg:shrink-0">
        <div className="px-5 py-5">{brand}</div>
        <nav
          aria-label={navLabel}
          className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible"
        >
          {nav}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3 border-b border-zinc-200 px-4 py-3 sm:px-8 dark:border-zinc-800">
          {header}
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

/** Nome de quem entrou + botão de sair (a Server Action de logout vem do app). */
export function AccountMenu({
  name,
  email,
  locale,
  logoutAction,
  labels,
}: {
  name: string;
  email: string;
  locale: string;
  logoutAction: (formData: FormData) => Promise<void>;
  labels: { logout: string; loggingOut: string };
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-right text-sm leading-tight">
        <p className="font-medium">{name}</p>
        <p className="text-zinc-500 dark:text-zinc-400">{email}</p>
      </div>
      <form action={logoutAction}>
        <input type="hidden" name="lang" value={locale} />
        <LogoutButton label={labels.logout} pendingLabel={labels.loggingOut} />
      </form>
    </div>
  );
}

/** Esqueleto enquanto a parte que depende da sessão carrega. */
export function Skeleton({ lines = 3, label }: { lines?: number; label: string }) {
  return (
    <div role="status" aria-label={label} className="animate-pulse space-y-3">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-zinc-200 dark:bg-zinc-800"
          style={{ width: `${90 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
