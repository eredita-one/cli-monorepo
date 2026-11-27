import { Info, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

// Peças das páginas do painel. Sem estado: servem a Server e a Client Components.

/** Iniciais para avatares: primeira letra do primeiro e do último nome. */
export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

/** Rótulo pequeno em dourado e caixa alta, acima de títulos. */
export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`block text-[11px] font-semibold tracking-[0.15em] text-gold-600 uppercase ${className}`}
    >
      {children}
    </span>
  );
}

/** Cabeçalho da página: rótulo, título, descrição e ações à direita. */
export function PageHeading({
  kicker,
  title,
  description,
  actions,
  titleId,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  titleId?: string;
}) {
  return (
    <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <h1
          id={titleId}
          className="mt-1.5 mb-1 text-[28px] leading-tight font-semibold tracking-[-0.025em] text-ink sm:text-[32px]"
        >
          {title}
        </h1>
        {description ? (
          <div className="text-sm text-ink-muted">{description}</div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2 max-sm:[&>*]:flex-1">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

/** Faixa de aviso discreta (ex.: dados fictícios). */
export function DemoNotice({
  title,
  children,
  badge,
}: {
  title: string;
  children: ReactNode;
  badge?: string;
}) {
  return (
    <div
      role="note"
      className="mb-4 flex items-start gap-2.5 rounded-lg border border-[#e9e8dc] bg-gold-50 px-3.5 py-2.5 sm:items-center"
    >
      <Info
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-gold-600 sm:mt-0"
      />
      <p className="flex-1 text-[13px] leading-relaxed text-ink-muted">
        <strong className="font-semibold text-ink-soft">{title}</strong>{" "}
        {children}
      </p>
      {badge ? (
        <span className="hidden items-center gap-1.5 text-xs whitespace-nowrap text-brand-700 sm:inline-flex">
          <ShieldCheck aria-hidden className="size-3.5" />
          {badge}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Indicador principal (card verde): valor em destaque à esquerda e um resumo à direita.
 * `decimals` aparece menor, em dourado, colado ao valor ("€ 2.102.250" + ",00").
 */
export function HighlightCard({
  eyebrow,
  title,
  value,
  decimals,
  meta,
  aside,
  watermark,
  titleId,
}: {
  eyebrow: string;
  title: string;
  value: string;
  decimals?: string;
  meta?: ReactNode[];
  aside?: ReactNode;
  watermark?: string;
  titleId?: string;
}) {
  return (
    <section
      aria-labelledby={titleId}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-brand-800 bg-brand-900 p-5 text-white sm:min-h-48 sm:flex-row sm:items-stretch sm:justify-between sm:px-7 sm:py-6"
    >
      <div className="relative z-10 flex flex-col items-start justify-center">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-white/70 uppercase">
          <span className="size-1.5 rounded-full bg-gold-300 shadow-[0_0_0_3px_rgb(216_189_127/0.15)]" />
          {eyebrow}
        </span>
        <h2
          id={titleId}
          className="mt-3.5 mb-1.5 text-lg font-medium text-white/90"
        >
          {title}
        </h2>
        <strong className="text-[clamp(30px,3.4vw,42px)] leading-none font-medium tracking-[-0.04em]">
          {value}
          {decimals ? (
            <span className="text-[0.62em] tracking-[-0.01em] text-gold-200/90">
              {decimals}
            </span>
          ) : null}
        </strong>
        {meta && meta.length > 0 ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-white/65">
            {meta.map((item, index) => (
              <span key={index} className="inline-flex items-center gap-2.5">
                {index > 0 ? (
                  <i
                    aria-hidden
                    className="size-[3px] rounded-full bg-gold-300"
                  />
                ) : null}
                {item}
              </span>
            ))}
          </p>
        ) : null}
      </div>
      {aside ? (
        <div className="relative z-10 flex flex-col justify-center border-t border-white/15 pt-3 sm:w-64 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
          {aside}
        </div>
      ) : null}
      {watermark ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-14 right-2 text-[220px] leading-[0.9] font-serif italic text-white/[0.035] select-none sm:right-72 sm:text-[260px]"
        >
          {watermark}
        </span>
      ) : null}
    </section>
  );
}

/** Linha do resumo ao lado do indicador principal. */
export function HighlightStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="grid size-8 place-items-center rounded-lg border border-white/15 text-gold-200 [&_svg]:size-4">
        {icon}
      </span>
      <span className="flex flex-col gap-0.5">
        <small className="text-xs text-white/65">{label}</small>
        <strong className="text-[15px] font-semibold">{value}</strong>
      </span>
    </div>
  );
}

const metricTones = {
  green: "bg-[#edf4ef] text-[#38674e]",
  gold: "bg-gold-100 text-[#9b7b40]",
  blue: "bg-[#eef4f5] text-[#587a86]",
  sage: "bg-[#eff4f0] text-[#5d7967]",
} as const;

export type MetricTone = keyof typeof metricTones;

export function MetricGrid({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className="mt-3.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3"
    >
      {children}
    </section>
  );
}

/** Indicador complementar: ícone, rótulo, valor e uma linha de contexto. */
export function MetricCard({
  icon,
  tone = "green",
  label,
  value,
  caption,
}: {
  icon: ReactNode;
  tone?: MetricTone;
  label: string;
  value: ReactNode;
  caption?: string;
}) {
  return (
    <article className="grid min-h-28 grid-cols-[auto_1fr] content-start gap-x-2.5 gap-y-1.5 rounded-xl border border-line bg-white p-3.5 shadow-[0_2px_7px_rgb(21_55_41/0.025)] sm:p-4">
      <span
        className={`row-span-2 grid size-8 place-items-center rounded-lg [&_svg]:size-[17px] ${metricTones[tone]}`}
      >
        {icon}
      </span>
      <span className="self-center text-xs text-ink-muted">{label}</span>
      <strong className="col-start-2 text-lg font-semibold tracking-[-0.025em] whitespace-nowrap text-ink sm:text-xl">
        {value}
      </strong>
      {caption ? (
        <small className="col-start-2 text-[11px] text-ink-faint">
          {caption}
        </small>
      ) : null}
    </article>
  );
}

/** Seção em card branco, com rótulo, título, descrição e ações. */
export function SectionCard({
  kicker,
  title,
  description,
  actions,
  titleId,
  children,
  className = "",
}: {
  kicker?: string;
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
  titleId?: string;
  children: ReactNode;
  className?: string;
}) {
  const hasHeader = kicker || title || description || actions;
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={`rounded-xl border border-line bg-white px-4 pt-4 pb-1 shadow-[0_2px_7px_rgb(21_55_41/0.02)] sm:px-5 sm:pt-5 ${className}`}
    >
      {hasHeader ? (
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {kicker ? <Kicker>{kicker}</Kicker> : null}
            {title ? (
              <h2
                id={titleId}
                className="mt-1 mb-1 text-xl font-semibold tracking-[-0.01em] text-ink"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <div className="text-[13px] text-ink-muted">{description}</div>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Quadrado com iniciais (clientes, pessoas em listas). */
export function InitialsBadge({ initials }: { initials: string }) {
  return (
    <span
      aria-hidden
      className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-[#eff4f0] text-[11px] font-bold text-brand-700"
    >
      {initials}
    </span>
  );
}

/** Página de um módulo que ainda não tem tela. */
export function ModulePlaceholder({
  icon,
  kicker,
  title,
  description,
  note,
  action,
}: {
  icon: ReactNode;
  kicker: string;
  title: string;
  description?: string;
  note?: string;
  action?: ReactNode;
}) {
  return (
    <section className="flex min-h-96 flex-col items-start justify-center rounded-xl border border-line bg-white p-6 sm:p-9">
      <span className="mb-5 grid size-11 place-items-center rounded-xl bg-[#edf4ef] text-brand-700 [&_svg]:size-5">
        {icon}
      </span>
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-2 mb-2 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
        {title}
      </h1>
      {description ? (
        <p className="max-w-xl text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
      {note ? (
        <p className="my-5 flex max-w-xl items-start gap-2 rounded-lg border border-line-soft bg-[#f8faf8] px-3.5 py-3 text-[13px] leading-relaxed text-ink-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-faint" />
          {note}
        </p>
      ) : (
        <div className="h-5" />
      )}
      {action}
    </section>
  );
}

/** Esqueleto enquanto a parte que depende da sessão carrega. */
export function Skeleton({
  lines = 3,
  label,
}: {
  lines?: number;
  label: string;
}) {
  return (
    <div role="status" aria-label={label} className="animate-pulse space-y-3">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-line"
          style={{ width: `${90 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
