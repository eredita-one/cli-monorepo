import type { StaffApp } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { PageHeading, Skeleton } from "@repo/ui/dashboard/blocks";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Notice } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { type AuditEntry, adminApi } from "@/lib/admin-api";
import { formatDateTime, load } from "@/lib/server";
import { type AuditFilters, AuditBrowser, type AuditRow } from "./audit-browser";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
type SearchParams = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 25;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).audit.title };
}

export default async function AuditPage({ searchParams }: PageProps<"/[lang]/audit">) {
  const locale = await getLocale();
  const dict = await getDictionary();
  return (
    <div>
      <PageHeading kicker={dict.shell.area} title={dict.audit.title} description={dict.audit.intro} />
      <Suspense fallback={<Skeleton lines={8} label={sharedMessages[locale].shell.loading} />}>
        <AuditTable locale={locale} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Página e filtros vindos do endereço. Valor estranho é ignorado (não vira erro da API). */
function parse(params: SearchParams, eventTypes: readonly string[]) {
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
  };
  const page = Number.parseInt(one("page"), 10);
  const filters: AuditFilters = {
    q: one("q").slice(0, 100),
    type: eventTypes.includes(one("type")) ? one("type") : "",
    person: UUID.test(one("person")) ? one("person") : "",
    from: DAY.test(one("from")) ? one("from") : "",
    to: DAY.test(one("to")) ? one("to") : "",
    order: one("order") === "asc" ? "asc" : "desc",
  };
  return { page: Number.isFinite(page) && page > 1 ? page : 1, filters };
}

async function AuditTable({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<SearchParams>;
}) {
  const dict = await getDictionary();
  const t = dict.audit;
  const events: Record<string, string> = t.events;
  const { page: requested, filters } = parse(await searchParams, Object.keys(events));

  const fetchPage = (page: number) =>
    load(() =>
      adminApi.listAudit({
        page,
        pageSize: PAGE_SIZE,
        order: filters.order,
        type: filters.type,
        personId: filters.person,
        search: filters.q,
        from: filters.from,
        to: filters.to,
      }),
    );
  // Nomes em vez de ids, quando a pessoa também pode listar usuários e perfis.
  const [first, users, profiles] = await Promise.all([
    fetchPage(requested),
    load(() => adminApi.listUsers()),
    load(() => adminApi.listProfiles()),
  ]);
  if ("error" in first && first.error === "forbidden") {
    return <Notice>{dict.common.noPermission}</Notice>;
  }

  let result = "data" in first ? first.data : { items: [], total: 0, page: 1, pageSize: PAGE_SIZE };
  let page = requested;
  // Endereço com página além da última (ex.: depois de filtrar): mostra a última.
  const last = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  if (page > last) {
    page = last;
    const retry = await fetchPage(last);
    if ("data" in retry) result = retry.data;
  }

  const userById = new Map("data" in users ? users.data.map((u) => [u.id, u]) : []);
  const profileNames = new Map("data" in profiles ? profiles.data.map((p) => [p.id, p.name]) : []);

  const subjectOf = (entry: AuditEntry) => {
    const name =
      entry.subjectType === "access_profile"
        ? (profileNames.get(entry.subjectId) ?? stringField(entry, "name"))
        : (userById.get(entry.subjectId)?.name ?? stringField(entry, "email"));
    return { name: name ?? shortId(entry.subjectId), kind: t.subjectKinds[entry.subjectType] };
  };

  const rows: AuditRow[] = result.items.map((entry) => {
    const actor = entry.actorId ? userById.get(entry.actorId) : undefined;
    return {
      id: entry.id,
      when: formatDateTime(locale, entry.occurredAt) ?? "",
      type: entry.type,
      typeLabel: events[entry.type] ?? entry.type,
      actor: entry.actorId
        ? { name: actor?.name ?? shortId(entry.actorId), email: actor?.email }
        : null,
      subject: subjectOf(entry),
      details: detailsOf(entry, dict, locale),
    };
  });

  return (
    <AuditBrowser
      rows={rows}
      total={result.total}
      page={page}
      pageSize={PAGE_SIZE}
      filters={filters}
      eventOptions={Object.entries(events)
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label, locale))}
      people={
        "data" in users
          ? users.data
              .map(({ id, name }) => ({ id, name }))
              .sort((a, b) => a.name.localeCompare(b.name, locale))
          : []
      }
      labels={{
        when: t.when,
        event: t.event,
        actor: t.actor,
        subject: t.subject,
        details: t.details,
        system: dict.common.system,
        search: t.search,
        searchPlaceholder: t.searchPlaceholder,
        filters: t.filters,
        sort: t.sort,
        sortOldest: t.sortOldest,
        sortNewest: t.sortNewest,
        eventFilter: t.eventFilter,
        allEvents: t.allEvents,
        personFilter: t.personFilter,
        allPeople: t.allPeople,
        from: t.from,
        to: t.to,
        clearFilters: t.clearFilters,
        showing: t.showing,
        page: t.page,
        previous: t.previous,
        next: t.next,
        empty: t.empty,
        noMatch: t.noMatch,
        noMatchHint: t.noMatchHint,
      }}
    />
  );
}

function stringField(entry: AuditEntry, field: string): string | undefined {
  const value = entry.data[field];
  return typeof value === "string" ? value : undefined;
}

const shortId = (id: string) => `#${id.slice(0, 8)}`;

/** Resumo de uma linha da auditoria, conforme o tipo do evento. */
function detailsOf(entry: AuditEntry, dict: Dictionary, locale: Locale): string {
  const app = stringField(entry, "app") as StaffApp | undefined;
  const appName = app ? dict.common.apps[app] : undefined;
  const count = (field: string) => {
    const value = entry.data[field];
    return Array.isArray(value) ? value.length : 0;
  };

  switch (entry.type) {
    case "AccessProfileGranted":
    case "AccessProfileRevoked":
      return [appName, stringField(entry, "profileName")].filter(Boolean).join(" · ");
    case "AccessProfileCreated":
    case "AccessProfileDeleted":
      return [appName, stringField(entry, "name")].filter(Boolean).join(" · ");
    case "AccessProfileUpdated":
    case "SystemProfileSynced": {
      const parts = [];
      const rename = entry.data.name as { from?: string; to?: string } | undefined;
      if (rename?.from && rename.to) parts.push(`${rename.from} → ${rename.to}`);
      if (count("added")) parts.push(`+${count("added")}`);
      if (count("removed")) parts.push(`−${count("removed")}`);
      return parts.join(" · ");
    }
    case "StaffUserCreated":
      return stringField(entry, "email") ?? "";
    case "StaffUserUpdated":
      return (["name", "email"] as const)
        .map((field) => entry.data[field] as { from?: string; to?: string } | undefined)
        .filter((change) => change?.from && change.to)
        .map((change) => `${change?.from} → ${change?.to}`)
        .join(" · ");
    case "AccountLocked":
      return formatDateTime(locale, stringField(entry, "until") ?? null) ?? "";
    default:
      return "";
  }
}
