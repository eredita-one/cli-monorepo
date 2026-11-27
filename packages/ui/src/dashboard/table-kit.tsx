import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { InitialsBadge } from "./blocks";
import { buttonClass } from "./styles";

// Peças das listas do painel no estilo da "Carteira de clientes": barra com busca e
// botões, painel de filtros, célula de identidade, estado vazio e rodapé com paginação.
// Sem estado: quem usa (um Client Component) guarda busca, filtros e página.

/** Barra acima da tabela: busca à esquerda, botões (Filtros, Ordenar...) à direita. */
export function TableToolbar({ search, actions }: { search: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pb-2.5 sm:flex-row sm:items-center sm:justify-between">
      {search}
      {actions ? <div className="flex gap-2 max-sm:[&>*]:flex-1">{actions}</div> : null}
    </div>
  );
}

export function SearchField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-line px-2.5 text-ink-faint focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-600/10 sm:w-80">
      <Search aria-hidden className="size-4 shrink-0" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
      />
    </label>
  );
}

/** Painel que abre pelo botão "Filtros". */
export function FilterPanel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2.5 flex flex-wrap items-center gap-2.5 rounded-lg border border-line-soft bg-[#fafcfb] p-2.5">
      {children}
    </div>
  );
}

/** Rótulo + seleção dentro do painel de filtros. */
export function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <span className="flex items-center gap-2 max-sm:w-full">
      <label htmlFor={id} className="text-xs whitespace-nowrap text-ink-muted">
        {label}
      </label>
      {/* Sem o `w-full` do campo padrão: vários filtros dividem a mesma linha. */}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 min-w-40 rounded-lg border border-line bg-white px-2.5 text-[13px] text-ink shadow-xs focus:border-brand-600 focus:ring-3 focus:ring-brand-600/10 focus:outline-none max-sm:min-w-0 max-sm:flex-1"
      >
        {children}
      </select>
    </span>
  );
}

/** Rótulo + data (dia) dentro do painel de filtros. */
export function FilterDate({
  id,
  label,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  label: string;
  /** `AAAA-MM-DD` ou vazio. */
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}) {
  return (
    <span className="flex items-center gap-2 max-sm:w-full">
      <label htmlFor={id} className="text-xs whitespace-nowrap text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 rounded-lg border border-line bg-white px-2.5 text-[13px] text-ink shadow-xs focus:border-brand-600 focus:ring-3 focus:ring-brand-600/10 focus:outline-none max-sm:flex-1"
      />
    </span>
  );
}

/** Nome em destaque com a linha de baixo (situação, e-mail...) e o avatar de iniciais. */
export function IdentityCell({
  initials,
  title,
  subtitle,
  href,
}: {
  initials: string;
  title: string;
  subtitle?: ReactNode;
  href?: string;
}) {
  return (
    <div className="flex min-w-36 items-center gap-2.5">
      <InitialsBadge initials={initials} />
      <span className="flex min-w-0 flex-col gap-0.5">
        {href ? (
          <Link href={href} className="truncate text-[13px] font-semibold text-ink-soft hover:text-brand-700 hover:underline">
            {title}
          </Link>
        ) : (
          <strong className="truncate text-[13px] font-semibold text-ink-soft">{title}</strong>
        )}
        {subtitle ? <small className="truncate text-xs text-ink-faint">{subtitle}</small> : null}
      </span>
    </div>
  );
}

/** Etiqueta neutra das listas (perfil, plano...). */
export function TagBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-[#f5f8f5] px-2 py-1 text-xs whitespace-nowrap text-ink-soft">
      {children}
    </span>
  );
}

/** Nada encontrado com a busca ou os filtros. */
export function TableEmpty({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center gap-1.5 px-4 py-6 text-center text-[13px] text-ink-muted">
      <Search aria-hidden className="size-[18px] text-ink-faint" />
      <strong className="text-sm text-ink-soft">{title}</strong>
      {hint ? <span>{hint}</span> : null}
      {action}
    </div>
  );
}

/** Rodapé: "Exibindo 1–4 de 7" e a paginação. */
export function TableFooter({
  summary,
  page,
  pages,
  labels,
  onPage,
}: {
  summary: ReactNode;
  /** Começa em 0. */
  page: number;
  pages: number;
  labels: { page: string; previous: string; next: string };
  onPage: (page: number) => void;
}) {
  return (
    <div className="flex min-h-12 flex-col gap-2 py-2.5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
      <span>{summary}</span>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          aria-label={labels.previous}
          disabled={page === 0}
          onClick={() => onPage(Math.max(0, page - 1))}
          className={buttonClass("outline", "icon")}
        >
          <ChevronLeft aria-hidden />
        </button>
        <span>{labels.page}</span>
        <button
          type="button"
          aria-label={labels.next}
          disabled={page + 1 >= pages}
          onClick={() => onPage(Math.min(pages - 1, page + 1))}
          className={buttonClass("outline", "icon")}
        >
          <ChevronRight aria-hidden />
        </button>
      </div>
    </div>
  );
}
