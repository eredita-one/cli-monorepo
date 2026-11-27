"use client";

import { CircleHelp, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import Link from "next/link";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { topbarIconButton } from "./styles";

/**
 * Estado da barra lateral. No computador: aberta → recolhida (só ícones) → oculta.
 * No celular ela vira uma gaveta, aberta pelo botão do cabeçalho.
 */
type SidebarMode = "expanded" | "collapsed" | "hidden";

type ShellState = {
  /** Barra recolhida no computador (no celular a gaveta mostra sempre os textos). */
  collapsed: boolean;
  /** Fecha a gaveta do celular (ao navegar). */
  closeDrawer: () => void;
};

const ShellContext = createContext<ShellState>({ collapsed: false, closeDrawer: () => {} });

/** Para as peças de dentro da barra lateral (menu, seletor de contexto). */
export function useShell() {
  return useContext(ShellContext);
}

export type ShellBrand = {
  /** Nome da marca (aparece em caixa alta). */
  name: string;
  /** Segunda parte do nome, em dourado (ex.: "ONE"). */
  product?: string;
  /** Linha de baixo (ex.: "Gestão patrimonial"). */
  tagline?: string;
  /** Símbolo; é o que fica visível com a barra recolhida. */
  mark: ReactNode;
};

/** Cartão de ajuda no pé da barra lateral. */
export type ShellHelp = { href: string; title: string; body: string; cta: string };

export type ShellLabels = {
  sidebar: string;
  openMenu: string;
  closeMenu: string;
  collapseSidebar: string;
  expandSidebar: string;
  hideSidebar: string;
  showSidebar: string;
  collapse: string;
};

/**
 * Moldura das áreas logadas: barra lateral (marca, contexto, menu, ajuda), cabeçalho
 * (trilha, busca, conta) e rodapé. Igual em todos os apps; cada um passa as peças.
 * As peças que dependem da sessão chegam prontas do servidor, dentro de <Suspense>.
 */
export function DashboardShell({
  brand,
  workspace,
  nav,
  help,
  topbarStart,
  topbarEnd,
  footer,
  labels,
  children,
}: {
  brand: ShellBrand;
  workspace?: ReactNode;
  nav: ReactNode;
  help?: ShellHelp;
  topbarStart?: ReactNode;
  topbarEnd?: ReactNode;
  footer?: ReactNode;
  labels: ShellLabels;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<SidebarMode>("expanded");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const collapsed = mode === "collapsed";

  // Esc fecha a gaveta do celular.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const state = useMemo(() => ({ collapsed, closeDrawer }), [collapsed, closeDrawer]);

  const cycleLabel =
    mode === "expanded"
      ? labels.collapseSidebar
      : mode === "collapsed"
        ? labels.hideSidebar
        : labels.showSidebar;
  const cycle = () =>
    setMode((current) =>
      current === "expanded" ? "collapsed" : current === "collapsed" ? "hidden" : "expanded",
    );

  return (
    <ShellContext value={state}>
      <div className="flex min-h-full flex-1 flex-col">
        {drawerOpen ? (
          <button
            type="button"
            tabIndex={-1}
            aria-label={labels.closeMenu}
            onClick={closeDrawer}
            className="fixed inset-0 z-30 bg-brand-950/50 md:hidden"
          />
        ) : null}

        <aside
          id="dashboard-sidebar"
          aria-label={labels.sidebar}
          className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,86vw)] flex-col bg-brand-900 px-3 pt-4 pb-3 text-white transition-[width,transform,visibility] duration-200 md:shadow-none ${
            drawerOpen
              ? "max-md:visible max-md:translate-x-0 max-md:shadow-2xl"
              : "max-md:invisible max-md:-translate-x-full"
          } ${mode === "hidden" ? "md:invisible md:-translate-x-full" : "md:visible md:translate-x-0"} ${
            collapsed ? "md:w-20" : "md:w-64"
          }`}
        >
          <div className="flex min-h-11 items-center justify-between gap-2 px-1.5">
            <div className={`flex min-w-0 items-center gap-2.5 ${collapsed ? "md:mx-auto" : ""}`}>
              {brand.mark}
              <span
                className={`flex min-w-0 flex-col gap-1 whitespace-nowrap ${collapsed ? "md:hidden" : ""}`}
              >
                <strong className="text-[13px] font-semibold tracking-[0.14em] text-white uppercase">
                  {brand.name}
                  {brand.product ? (
                    <span className="ml-1.5 text-[10px] font-medium tracking-[0.12em] text-gold-300">
                      {brand.product}
                    </span>
                  ) : null}
                </strong>
                {brand.tagline ? (
                  <small className="text-[9px] tracking-[0.18em] text-white/55 uppercase">
                    {brand.tagline}
                  </small>
                ) : null}
              </span>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label={labels.closeMenu}
              className="grid size-8 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white md:hidden"
            >
              <X aria-hidden className="size-[18px]" />
            </button>
          </div>

          {workspace ? <div className="mt-5 mb-3">{workspace}</div> : <div className="mt-4" />}

          <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-2 [scrollbar-color:rgb(255_255_255/0.2)_transparent] [scrollbar-width:thin]">
            {nav}
          </div>

          <div className="border-t border-white/10 pt-2">
            {help ? (
              <div
                className={`mx-0.5 mb-2.5 flex gap-2.5 rounded-lg border border-white/15 bg-white/5 p-2.5 ${collapsed ? "md:hidden" : ""}`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white/10 text-gold-200">
                  <CircleHelp aria-hidden className="size-4" />
                </span>
                <div className="flex flex-col items-start gap-1">
                  <strong className="text-xs font-semibold text-white/90">{help.title}</strong>
                  <small className="text-[11px] text-white/55">{help.body}</small>
                  <Link
                    href={help.href}
                    onClick={closeDrawer}
                    className="pt-0.5 text-[11px] font-medium text-gold-300 hover:text-gold-200"
                  >
                    {help.cta} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setMode((current) => (current === "collapsed" ? "expanded" : "collapsed"))}
              aria-label={collapsed ? labels.expandSidebar : labels.collapseSidebar}
              title={collapsed ? labels.expandSidebar : undefined}
              className={`hidden h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-xs text-white/65 transition-colors hover:bg-white/7 hover:text-white md:flex ${
                collapsed ? "md:justify-center md:px-0" : ""
              }`}
            >
              {collapsed ? (
                <PanelLeftOpen aria-hidden className="size-4" />
              ) : (
                <PanelLeftClose aria-hidden className="size-4" />
              )}
              <span className={collapsed ? "md:hidden" : ""}>{labels.collapse}</span>
            </button>
          </div>
        </aside>

        <div
          className={`flex min-h-screen flex-col transition-[padding] duration-200 ${
            mode === "expanded" ? "md:pl-64" : collapsed ? "md:pl-20" : "md:pl-0"
          }`}
        >
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-white px-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={cycle}
                aria-label={cycleLabel}
                title={cycleLabel}
                className={`${topbarIconButton} hidden md:grid`}
              >
                <Menu aria-hidden className="size-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={labels.openMenu}
                aria-expanded={drawerOpen}
                aria-controls="dashboard-sidebar"
                className={`${topbarIconButton} md:hidden`}
              >
                <Menu aria-hidden className="size-[18px]" />
              </button>
              {topbarStart}
            </div>
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">{topbarEnd}</div>
          </header>

          <main className="flex flex-1 flex-col px-4 pt-6 pb-3 sm:px-6 lg:px-8 2xl:px-10">
            <div className="flex-1">{children}</div>
            {footer}
          </main>
        </div>
      </div>
    </ShellContext>
  );
}
