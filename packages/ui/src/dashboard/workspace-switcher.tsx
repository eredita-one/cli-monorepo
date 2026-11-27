"use client";

import { ArrowUpRight, Building2, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useShell } from "./shell";
import { useDismiss } from "./use-dismiss";

export type Workspace = {
  /** Onde a pessoa está (ex.: "Gestão interna"). */
  current: { name: string; detail?: string };
  /** Outros apps a que ela tem acesso, com o endereço de cada um. */
  options: { id: string; name: string; detail?: string; href: string }[];
};

/**
 * "Contexto de trabalho" no topo da barra lateral: mostra o app atual e leva aos outros
 * apps da pessoa. Cada app tem a própria sessão: o outro pode pedir login.
 */
export function WorkspaceSwitcher({
  workspace,
  labels,
}: {
  workspace: Workspace;
  labels: { caption: string; switchTo: string };
}) {
  const { collapsed } = useShell();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  useDismiss(boxRef, open, () => setOpen(false));
  const { current, options } = workspace;
  const canSwitch = options.length > 0;

  const body = (
    <>
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/10 text-gold-200">
        <Building2 aria-hidden className="size-4" />
      </span>
      <span className={`flex min-w-0 flex-1 flex-col gap-0.5 ${collapsed ? "md:hidden" : ""}`}>
        <strong className="truncate text-xs font-semibold text-white">{current.name}</strong>
        {current.detail ? (
          <small className="truncate text-[11px] text-white/55">{current.detail}</small>
        ) : null}
      </span>
    </>
  );
  const boxClass = `flex min-h-12 w-full items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-left ${
    collapsed ? "md:mx-auto md:min-h-11 md:w-11 md:justify-center md:px-0" : ""
  }`;

  return (
    <div ref={boxRef} className="relative">
      <span
        className={`block px-2 pb-2 text-[10px] font-semibold tracking-[0.13em] text-white/45 uppercase ${collapsed ? "md:hidden" : ""}`}
      >
        {labels.caption}
      </span>

      {canSwitch ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          title={collapsed ? current.name : undefined}
          className={`${boxClass} transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-gold-300`}
        >
          {body}
          <ChevronDown
            aria-hidden
            className={`size-3.5 shrink-0 text-white/55 transition-transform ${open ? "rotate-180" : ""} ${collapsed ? "md:hidden" : ""}`}
          />
        </button>
      ) : (
        <div className={boxClass} title={collapsed ? current.name : undefined}>
          {body}
        </div>
      )}

      {open ? (
        <div
          className={`absolute top-[calc(100%+6px)] left-0 z-50 rounded-lg border border-white/15 bg-brand-800 p-1.5 shadow-[0_12px_28px_rgb(7_30_23/0.5)] ${
            collapsed ? "w-60" : "right-0"
          }`}
        >
          <p className="px-2 pt-1 pb-1.5 text-[10px] font-semibold tracking-[0.1em] text-white/45 uppercase">
            {labels.switchTo}
          </p>
          <ul>
            {options.map((option) => (
              <li key={option.id}>
                <a
                  href={option.href}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-2 text-xs text-white/85 hover:bg-white/10 hover:text-white"
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-medium">{option.name}</span>
                    {option.detail ? (
                      <small className="truncate text-[11px] text-white/50">{option.detail}</small>
                    ) : null}
                  </span>
                  <ArrowUpRight aria-hidden className="size-3.5 shrink-0 text-gold-300" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
