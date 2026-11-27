import { Kicker } from "@repo/ui/dashboard/blocks";
import { buttonClass as dashboardButton, inputClass as dashboardInput, tableClass as dashboardTable } from "@repo/ui/dashboard/styles";
import Link from "next/link";
import type { ReactNode } from "react";

// Peças visuais das telas do admin, no padrão do painel (@repo/ui/dashboard).
// Server Components (sem estado).

export const buttonClass = {
  primary: `${dashboardButton("primary")} disabled:cursor-wait`,
  secondary: `${dashboardButton("outline")} disabled:cursor-wait`,
  danger: `${dashboardButton("danger")} disabled:cursor-wait`,
  small: `${dashboardButton("outline", "sm")} disabled:cursor-wait`,
} as const;

export const inputClass = dashboardInput;

export function PageHeader({
  title,
  kicker,
  description,
  back,
  actions,
}: {
  title: string;
  kicker?: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      {back ? (
        <Link href={back.href} className="text-[13px] font-medium text-brand-700 hover:underline">
          ← {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          {kicker ? <Kicker>{kicker}</Kicker> : null}
          <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
            {title}
          </h1>
          {description ? <div className="text-sm text-ink-muted">{description}</div> : null}
        </div>
        {actions}
      </div>
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-line bg-white p-5 shadow-[0_2px_7px_rgb(21_55_41/0.02)] ${className}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2> : null}
      {children}
    </section>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-line-soft bg-[#f8faf8] px-4 py-3 text-sm text-ink-muted">
      {children}
    </p>
  );
}

const badgeTones = {
  neutral: "border-line bg-[#f5f8f5] text-ink-soft",
  brand: "border-brand-100 bg-brand-50 text-brand-800",
  warning: "border-gold-200 bg-gold-50 text-gold-700",
  danger: "border-red-100 bg-red-50 text-red-700",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof badgeTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

export const tableClass = {
  wrapper: `${dashboardTable.wrapper} rounded-xl border border-line bg-white`,
  table: `${dashboardTable.table} text-[13px]`,
  head: dashboardTable.head,
  th: `${dashboardTable.th} border-t-0 px-4`,
  row: `${dashboardTable.row} last:border-b-0`,
  td: "px-4 py-3 align-top text-ink-soft",
} as const;
