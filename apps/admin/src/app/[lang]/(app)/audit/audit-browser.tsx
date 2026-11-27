"use client";

import { format } from "@repo/i18n/format";
import { initialsOf, SectionCard } from "@repo/ui/dashboard/blocks";
import { buttonClass, tableClass } from "@repo/ui/dashboard/styles";
import {
  FilterDate,
  FilterPanel,
  FilterSelect,
  IdentityCell,
  SearchField,
  TableEmpty,
  TableFooter,
  TableToolbar,
} from "@repo/ui/dashboard/table-kit";
import { ArrowDownUp, Cpu, Filter } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState, useTransition } from "react";

export type AuditFilters = {
  q: string;
  type: string;
  person: string;
  from: string;
  to: string;
  order: "desc" | "asc";
};

export type AuditRow = {
  id: string;
  /** Já formatado no servidor. */
  when: string;
  type: string;
  typeLabel: string;
  actor: { name: string; email?: string } | null;
  subject: { name: string; kind: string };
  details: string;
};

/** Cor do marcador de cada evento, por assunto: segurança, acesso, perfis, contas, senha. */
function toneOf(type: string) {
  if (type === "AccountLocked" || type === "SessionReuseDetected") return "bg-red-500";
  if (type === "AccessProfileGranted" || type === "AccessProfileRevoked") return "bg-gold-500";
  if (type.startsWith("AccessProfile") || type === "SystemProfileSynced") return "bg-sky-600";
  if (type === "StaffUserPasswordReset" || type === "PasswordChanged") return "bg-violet-500";
  return "bg-brand-600";
}

/**
 * Auditoria no mesmo card das outras listas. Ao contrário delas, a paginação e os filtros
 * são da API (a trilha só cresce): aqui só mudamos o endereço, e o servidor busca a página.
 */
export function AuditBrowser({
  rows,
  total,
  page,
  pageSize,
  filters,
  eventOptions,
  people,
  labels,
}: {
  rows: AuditRow[];
  total: number;
  page: number;
  pageSize: number;
  filters: AuditFilters;
  eventOptions: { value: string; label: string }[];
  people: { id: string; name: string }[];
  labels: {
    when: string;
    event: string;
    actor: string;
    subject: string;
    details: string;
    system: string;
    search: string;
    searchPlaceholder: string;
    filters: string;
    sort: string;
    sortOldest: string;
    sortNewest: string;
    eventFilter: string;
    allEvents: string;
    personFilter: string;
    allPeople: string;
    from: string;
    to: string;
    clearFilters: string;
    showing: string;
    page: string;
    previous: string;
    next: string;
    empty: string;
    noMatch: string;
    noMatchHint: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.q);
  const [filterOpen, setFilterOpen] = useState(
    () => !!(filters.type || filters.person || filters.from || filters.to),
  );

  /** Filtro novo volta à página 1; trocar de página entra no histórico (o "voltar" funciona). */
  function navigate(changes: Partial<AuditFilters> & { page?: number }) {
    const next = { ...filters, page: 1, ...changes };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.type) params.set("type", next.type);
    if (next.person) params.set("person", next.person);
    if (next.from) params.set("from", next.from);
    if (next.to) params.set("to", next.to);
    if (next.order === "asc") params.set("order", "asc");
    if (next.page > 1) params.set("page", String(next.page));
    const url = params.size > 0 ? `${pathname}?${params}` : pathname;
    startTransition(() => {
      if (changes.page !== undefined) router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    });
  }

  // A busca vai à API só depois de uma pausa na digitação.
  const searchNow = useEffectEvent((value: string) => {
    if (value !== filters.q) navigate({ q: value });
  });
  useEffect(() => {
    const timer = setTimeout(() => searchNow(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const clear = () => {
    setSearch("");
    navigate({ q: "", type: "", person: "", from: "", to: "" });
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total);
  const activeFilters = [filters.type, filters.person, filters.from, filters.to].filter(Boolean).length;
  const filtering = activeFilters > 0 || filters.q !== "";

  const event = (row: AuditRow) => (
    <span className="inline-flex items-center gap-2 font-medium text-ink-soft">
      <i aria-hidden className={`size-2 shrink-0 rounded-full ${toneOf(row.type)}`} />
      {row.typeLabel}
    </span>
  );
  const actor = (row: AuditRow) =>
    row.actor ? (
      <IdentityCell initials={initialsOf(row.actor.name)} title={row.actor.name} subtitle={row.actor.email} />
    ) : (
      <span className="inline-flex items-center gap-2 text-ink-faint">
        <span className="grid size-8 place-items-center rounded-lg border border-line bg-[#f5f8f5]">
          <Cpu aria-hidden className="size-4" />
        </span>
        {labels.system}
      </span>
    );
  const subject = (row: AuditRow) => (
    <span className="flex flex-col gap-0.5">
      <span className="font-medium text-ink-soft">{row.subject.name}</span>
      <small className="text-xs text-ink-faint">{row.subject.kind}</small>
    </span>
  );
  const empty = filtering ? (
    <TableEmpty
      title={labels.noMatch}
      hint={labels.noMatchHint}
      action={
        <button type="button" onClick={clear} className="mt-1 font-medium text-brand-700 hover:underline">
          {labels.clearFilters}
        </button>
      }
    />
  ) : (
    <TableEmpty title={labels.empty} />
  );

  return (
    <SectionCard>
      <TableToolbar
        search={
          <SearchField
            label={labels.search}
            placeholder={labels.searchPlaceholder}
            value={search}
            onChange={setSearch}
          />
        }
        actions={
          <>
            <button
              type="button"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((value) => !value)}
              className={buttonClass("outline", "sm")}
            >
              <Filter aria-hidden />
              {labels.filters}
              {activeFilters > 0 ? (
                <span className="grid size-4.5 place-items-center rounded-full bg-brand-700 text-[10px] font-semibold text-white">
                  {activeFilters}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label={filters.order === "asc" ? labels.sortNewest : labels.sortOldest}
              aria-pressed={filters.order === "asc"}
              onClick={() => navigate({ order: filters.order === "asc" ? "desc" : "asc" })}
              className={buttonClass("outline", "sm")}
            >
              <ArrowDownUp aria-hidden />
              {labels.sort}
            </button>
          </>
        }
      />

      {filterOpen ? (
        <FilterPanel>
          <FilterSelect
            id="audit-type"
            label={labels.eventFilter}
            value={filters.type}
            onChange={(type) => navigate({ type })}
          >
            <option value="">{labels.allEvents}</option>
            {eventOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            id="audit-person"
            label={labels.personFilter}
            value={filters.person}
            onChange={(person) => navigate({ person })}
          >
            <option value="">{labels.allPeople}</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </FilterSelect>
          <FilterDate
            id="audit-from"
            label={labels.from}
            value={filters.from}
            max={filters.to || undefined}
            onChange={(value) => navigate({ from: value })}
          />
          <FilterDate
            id="audit-to"
            label={labels.to}
            value={filters.to}
            min={filters.from || undefined}
            onChange={(value) => navigate({ to: value })}
          />
          <button type="button" className={buttonClass("ghost", "sm")} onClick={clear}>
            {labels.clearFilters}
          </button>
        </FilterPanel>
      ) : null}

      <div aria-busy={pending} className={`transition-opacity ${pending ? "opacity-60" : ""}`}>
        <div className={`${tableClass.wrapper} max-lg:hidden`}>
          <table className={tableClass.table}>
            <thead className={tableClass.head}>
              <tr>
                <th className={tableClass.th}>{labels.when}</th>
                <th className={tableClass.th}>{labels.event}</th>
                <th className={tableClass.th}>{labels.actor}</th>
                <th className={tableClass.th}>{labels.subject}</th>
                <th className={tableClass.th}>{labels.details}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={tableClass.row}>
                  <td className={`${tableClass.td} whitespace-nowrap`}>{row.when}</td>
                  <td className={tableClass.td}>{event(row)}</td>
                  <td className={tableClass.td}>{actor(row)}</td>
                  <td className={tableClass.td}>{subject(row)}</td>
                  <td className={tableClass.td}>{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? empty : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:hidden">
          {rows.map((row) => (
            <article key={row.id} className="rounded-lg border border-line-soft p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                {event(row)}
                <span className="text-xs text-ink-faint">{row.when}</span>
              </div>
              <dl className="mt-2.5 grid gap-2.5 border-t border-line-soft pt-2.5 text-xs text-ink-soft">
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] text-ink-faint">{labels.actor}</dt>
                  <dd>{actor(row)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] text-ink-faint">{labels.subject}</dt>
                  <dd>{subject(row)}</dd>
                </div>
                {row.details ? (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] text-ink-faint">{labels.details}</dt>
                    <dd>{row.details}</dd>
                  </div>
                ) : null}
              </dl>
            </article>
          ))}
          {rows.length === 0 ? <div className="sm:col-span-2">{empty}</div> : null}
        </div>
      </div>

      <TableFooter
        summary={format(labels.showing, { from, to, total })}
        page={page - 1}
        pages={pages}
        labels={{
          page: format(labels.page, { page, pages }),
          previous: labels.previous,
          next: labels.next,
        }}
        onPage={(index) => navigate({ page: index + 1 })}
      />
    </SectionCard>
  );
}
