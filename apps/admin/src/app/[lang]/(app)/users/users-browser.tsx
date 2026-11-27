"use client";

import type { StaffApp } from "@repo/auth/config";
import { format } from "@repo/i18n/format";
import { initialsOf, SectionCard } from "@repo/ui/dashboard/blocks";
import { buttonClass, tableClass } from "@repo/ui/dashboard/styles";
import {
  FilterPanel,
  FilterSelect,
  IdentityCell,
  SearchField,
  TableEmpty,
  TableFooter,
  TableToolbar,
  TagBadge,
} from "@repo/ui/dashboard/table-kit";
import { ArrowDownUp, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "DISABLED";
  invitePending: boolean;
  profiles: { id: string; app: StaffApp; name: string }[];
  /** ISO, para ordenar. */
  lastLoginAt: string | null;
  /** Já formatado no servidor (evita diferença de fuso entre servidor e navegador). */
  lastLogin: string;
};

type Status = "" | "active" | "disabled" | "pending";
type Filters = { q: string; status: Status; app: string; profile: string };
type Sort = null | "recent" | "oldest";

const EMPTY: Filters = { q: "", status: "", app: "", profile: "" };
const PAGE_SIZE = 10;

/** Sem acento e em minúsculas: "joao" acha "João". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matches(user: UserRow, filters: Filters, term: string) {
  if (term) {
    const haystack = normalize(
      [user.name, user.email, ...user.profiles.map((profile) => profile.name)].join(" "),
    );
    if (!haystack.includes(term)) return false;
  }
  if (filters.status === "active" && user.status !== "ACTIVE") return false;
  if (filters.status === "disabled" && user.status !== "DISABLED") return false;
  if (filters.status === "pending" && !user.invitePending) return false;
  if (filters.app === "none" && user.profiles.length > 0) return false;
  if (filters.app && filters.app !== "none" && !user.profiles.some((p) => p.app === filters.app)) {
    return false;
  }
  if (filters.profile && !user.profiles.some((p) => p.id === filters.profile)) return false;
  return true;
}

/** Último acesso mais recente primeiro (ou o contrário); quem nunca entrou fica no fim. */
function byLastLogin(order: Exclude<Sort, null>) {
  return (a: UserRow, b: UserRow) => {
    if (!a.lastLoginAt || !b.lastLoginAt) return a.lastLoginAt ? -1 : b.lastLoginAt ? 1 : 0;
    const diff = Date.parse(b.lastLoginAt) - Date.parse(a.lastLoginAt);
    return order === "recent" ? diff : -diff;
  };
}

/**
 * Usuários da equipe, no mesmo card da "Carteira de clientes": busca, filtros num painel,
 * ordenação por último acesso e paginação. A API devolve todos de uma vez, então o filtro
 * é feito aqui. Busca e filtros ficam no endereço (`?q=&status=&app=&profile=`).
 */
export function UsersBrowser({
  locale,
  users,
  appNames,
  labels,
}: {
  locale: string;
  users: UserRow[];
  appNames: Record<StaffApp, string>;
  labels: {
    user: string;
    status: string;
    profiles: string;
    lastLogin: string;
    actions: string;
    active: string;
    disabled: string;
    invitePending: string;
    search: string;
    searchPlaceholder: string;
    filters: string;
    sort: string;
    sortRecent: string;
    sortOldest: string;
    allStatuses: string;
    area: string;
    allAreas: string;
    noArea: string;
    profile: string;
    allProfiles: string;
    clearFilters: string;
    showing: string;
    page: string;
    previous: string;
    next: string;
    noMatch: string;
    noMatchHint: string;
    openUser: string;
  };
}) {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => ({
    q: params.get("q") ?? "",
    status: (["active", "disabled", "pending"].includes(params.get("status") ?? "")
      ? params.get("status")
      : "") as Status,
    app: params.get("app") ?? "",
    profile: params.get("profile") ?? "",
  }));
  // O painel começa aberto quando o endereço já traz algum filtro.
  const [filterOpen, setFilterOpen] = useState(
    () => !!(params.get("status") || params.get("app") || params.get("profile")),
  );
  const [sort, setSort] = useState<Sort>(null);
  const [page, setPage] = useState(0);

  const update = (changes: Partial<Filters>) => {
    const next = { ...filters, ...changes };
    setFilters(next);
    setPage(0);
    // Só o endereço muda (sem recarregar dados): o Next sincroniza com o histórico nativo.
    const query = new URLSearchParams(
      Object.entries(next).filter(([, value]) => value !== ""),
    ).toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  };

  // Perfis que aparecem na lista, por área (para o filtro de perfil).
  const profileOptions = useMemo(() => {
    const byId = new Map(users.flatMap((user) => user.profiles).map((p) => [p.id, p]));
    return (Object.keys(appNames) as StaffApp[])
      .map((app) => ({
        app,
        items: [...byId.values()]
          .filter((p) => p.app === app)
          .sort((a, b) => a.name.localeCompare(b.name, locale)),
      }))
      .filter((group) => group.items.length > 0);
  }, [users, appNames, locale]);

  const term = normalize(filters.q.trim());
  const filtered = useMemo(() => {
    const found = users.filter((user) => matches(user, filters, term));
    return sort ? [...found].sort(byLastLogin(sort)) : found;
  }, [users, filters, term, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const from = filtered.length ? current * PAGE_SIZE + 1 : 0;
  const to = Math.min((current + 1) * PAGE_SIZE, filtered.length);
  const activeFilters = [filters.status, filters.app, filters.profile].filter(Boolean).length;

  const status = (user: UserRow) => (
    <div className="flex flex-wrap gap-1.5">
      {user.status === "ACTIVE" ? (
        <Badge tone="brand">{labels.active}</Badge>
      ) : (
        <Badge tone="danger">{labels.disabled}</Badge>
      )}
      {user.invitePending ? <Badge tone="warning">{labels.invitePending}</Badge> : null}
    </div>
  );
  const profiles = (user: UserRow) => (
    <div className="flex flex-wrap gap-1.5">
      {user.profiles.map((profile) => (
        <TagBadge key={profile.id}>
          {appNames[profile.app]} · {profile.name}
        </TagBadge>
      ))}
    </div>
  );
  const identity = (user: UserRow) => (
    <IdentityCell
      initials={initialsOf(user.name)}
      title={user.name}
      subtitle={user.email}
      href={`/${locale}/users/${user.id}`}
    />
  );
  const open = (user: UserRow) => (
    <Link
      href={`/${locale}/users/${user.id}`}
      aria-label={format(labels.openUser, { name: user.name })}
      className={`${buttonClass("ghost", "icon")} text-ink-muted`}
    >
      <ChevronRight aria-hidden />
    </Link>
  );
  const empty = (
    <TableEmpty
      title={labels.noMatch}
      hint={labels.noMatchHint}
      action={
        <button
          type="button"
          onClick={() => update(EMPTY)}
          className="mt-1 font-medium text-brand-700 hover:underline"
        >
          {labels.clearFilters}
        </button>
      }
    />
  );

  return (
    <SectionCard>
      <TableToolbar
        search={
          <SearchField
            label={labels.search}
            placeholder={labels.searchPlaceholder}
            value={filters.q}
            onChange={(q) => update({ q })}
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
              aria-label={sort === "recent" ? labels.sortOldest : labels.sortRecent}
              aria-pressed={sort !== null}
              onClick={() => {
                setSort((value) => (value === "recent" ? "oldest" : "recent"));
                setPage(0);
              }}
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
            id="users-status"
            label={labels.status}
            value={filters.status}
            onChange={(value) => update({ status: value as Status })}
          >
            <option value="">{labels.allStatuses}</option>
            <option value="active">{labels.active}</option>
            <option value="disabled">{labels.disabled}</option>
            <option value="pending">{labels.invitePending}</option>
          </FilterSelect>
          <FilterSelect
            id="users-area"
            label={labels.area}
            value={filters.app}
            onChange={(value) => update({ app: value })}
          >
            <option value="">{labels.allAreas}</option>
            {(Object.keys(appNames) as StaffApp[]).map((app) => (
              <option key={app} value={app}>
                {appNames[app]}
              </option>
            ))}
            <option value="none">{labels.noArea}</option>
          </FilterSelect>
          <FilterSelect
            id="users-profile"
            label={labels.profile}
            value={filters.profile}
            onChange={(value) => update({ profile: value })}
          >
            <option value="">{labels.allProfiles}</option>
            {profileOptions.map((group) => (
              <optgroup key={group.app} label={appNames[group.app]}>
                {group.items.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </FilterSelect>
          <button type="button" className={buttonClass("ghost", "sm")} onClick={() => update(EMPTY)}>
            {labels.clearFilters}
          </button>
        </FilterPanel>
      ) : null}

      <div className={`${tableClass.wrapper} max-lg:hidden`}>
        <table className={tableClass.table}>
          <thead className={tableClass.head}>
            <tr>
              <th className={tableClass.th}>{labels.user}</th>
              <th className={tableClass.th}>{labels.status}</th>
              <th className={tableClass.th}>{labels.profiles}</th>
              <th className={tableClass.th}>{labels.lastLogin}</th>
              <th className={tableClass.th}>
                <span className="sr-only">{labels.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((user) => (
              <tr key={user.id} className={tableClass.row}>
                <td className={tableClass.td}>{identity(user)}</td>
                <td className={tableClass.td}>{status(user)}</td>
                <td className={tableClass.td}>{profiles(user)}</td>
                <td className={`${tableClass.td} whitespace-nowrap`}>{user.lastLogin}</td>
                <td className={`${tableClass.td} w-10`}>{open(user)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? empty : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:hidden">
        {visible.map((user) => (
          <article key={user.id} className="rounded-lg border border-line-soft p-3">
            <div className="flex items-center justify-between gap-2">
              {identity(user)}
              {open(user)}
            </div>
            <dl className="mt-2.5 grid gap-2.5 border-t border-line-soft pt-2.5 text-xs text-ink-soft">
              <div className="flex flex-col gap-1">
                <dt className="text-[11px] text-ink-faint">{labels.status}</dt>
                <dd>{status(user)}</dd>
              </div>
              {user.profiles.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] text-ink-faint">{labels.profiles}</dt>
                  <dd>{profiles(user)}</dd>
                </div>
              ) : null}
              <div className="flex flex-col gap-1">
                <dt className="text-[11px] text-ink-faint">{labels.lastLogin}</dt>
                <dd>{user.lastLogin}</dd>
              </div>
            </dl>
          </article>
        ))}
        {visible.length === 0 ? <div className="sm:col-span-2">{empty}</div> : null}
      </div>

      <TableFooter
        summary={format(labels.showing, { from, to, total: filtered.length })}
        page={current}
        pages={pages}
        labels={{
          page: format(labels.page, { page: current + 1, pages }),
          previous: labels.previous,
          next: labels.next,
        }}
        onPage={setPage}
      />
    </SectionCard>
  );
}
