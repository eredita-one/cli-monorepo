"use client";

import { format } from "@repo/i18n/format";
import {
  DemoNotice,
  HighlightCard,
  HighlightStat,
  InitialsBadge,
  initialsOf,
  MetricCard,
  MetricGrid,
  PageHeading,
  SectionCard,
} from "@repo/ui/dashboard/blocks";
import { buttonClass, inputClass, tableClass } from "@repo/ui/dashboard/styles";
import {
  ArrowDownUp,
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/types";

type Profile = "investment" | "immigration" | "both";
type Status = "active" | "review" | "pending";

type PortfolioClient = {
  name: string;
  profile: Profile;
  consultant: string;
  capital: number;
  contract: number;
  balance: number;
  status: Status;
};

// Dados fictícios do protótipo, até o cadastro de clientes existir na API.
const PORTFOLIO: PortfolioClient[] = [
  {
    name: "Mariana Costa",
    profile: "investment",
    consultant: "Anderson",
    capital: 44000,
    contract: 8400,
    balance: 2400,
    status: "active",
  },
  {
    name: "Rafael Lima",
    profile: "both",
    consultant: "Monique",
    capital: 49000,
    contract: 11900,
    balance: 6900,
    status: "active",
  },
  {
    name: "Beatriz Rocha",
    profile: "immigration",
    consultant: "Marquinhos",
    capital: 113000,
    contract: 14500,
    balance: 8500,
    status: "review",
  },
  {
    name: "Lucas Duarte",
    profile: "investment",
    consultant: "Rosália",
    capital: 59000,
    contract: 9200,
    balance: 4200,
    status: "active",
  },
  {
    name: "Ana Ribeiro",
    profile: "both",
    consultant: "Osvaldo",
    capital: 64000,
    contract: 16000,
    balance: 9000,
    status: "pending",
  },
  {
    name: "Pedro Martins",
    profile: "immigration",
    consultant: "Felipe",
    capital: 201450,
    contract: 22000,
    balance: 12000,
    status: "active",
  },
  {
    name: "Camila Souza",
    profile: "investment",
    consultant: "Jackie",
    capital: 291600,
    contract: 18074,
    balance: 5074,
    status: "active",
  },
];

const TOTALS = {
  capital: 2102250,
  clients: 26,
  properties: 39,
  contracted: 100074,
  received: 52000,
};
const PROFILES: Profile[] = ["investment", "immigration", "both"];
const PAGE_SIZE = 4;

/** Valor em euro dividido em parte inteira e centavos (os centavos aparecem menores). */
function splitDecimals(formatter: Intl.NumberFormat, value: number) {
  const parts = formatter.formatToParts(value);
  const decimal = parts.findIndex((part) => part.type === "decimal");
  if (decimal < 0) return { value: formatter.format(value) };
  const join = (list: Intl.NumberFormatPart[]) =>
    list.map((part) => part.value).join("");
  return {
    value: join(parts.slice(0, decimal)),
    decimals: join(parts.slice(decimal)),
  };
}

/** Visão geral do admin: indicador principal, indicadores complementares e a carteira. */
export function PortfolioOverview({
  locale,
  today,
  t,
}: {
  locale: string;
  /** Data de hoje, já formatada no servidor. */
  today: string;
  t: Dictionary["overview"];
}) {
  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }),
    [locale],
  );
  const [notice, setNotice] = useState("");
  const [opened, setOpened] = useState<PortfolioClient | null>(null);

  const openClient = (client: PortfolioClient) => {
    setOpened(client);
    setNotice(format(t.client.opened, { name: client.name }));
  };

  return (
    <div>
      {notice ? (
        <div
          role="status"
          className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#d9e8dc] bg-[#f1f7f2] px-3.5 py-2.5 text-[13px] text-[#3f6b4e]"
        >
          <span className="flex items-center gap-2">
            <Check aria-hidden className="size-4 shrink-0" />
            {notice}
          </span>
          <button
            type="button"
            aria-label={t.dismiss}
            onClick={() => setNotice("")}
            className="grid size-6 place-items-center rounded text-[#678772] hover:bg-white/60"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      ) : null}

      {opened ? (
        <ClientRecord
          client={opened}
          money={money}
          t={t}
          onBack={() => {
            setOpened(null);
            setNotice("");
          }}
        />
      ) : (
        <>
          <PageHeading
            title={t.title}
            description={t.description}
            actions={
              <>
                <button
                  type="button"
                  className={buttonClass("outline")}
                  onClick={() => setNotice(t.exportDone)}
                >
                  <Download aria-hidden />
                  {t.export}
                </button>
                <button
                  type="button"
                  className={buttonClass("primary")}
                  onClick={() => setNotice(t.newRecordDone)}
                >
                  <Plus aria-hidden />
                  {t.newRecord}
                </button>
              </>
            }
          />

          <DemoNotice title={t.demoTitle} badge={t.demoBadge}>
            {t.demoBody}
          </DemoNotice>

          <HighlightCard
            titleId="capital-heading"
            eyebrow={t.capital.eyebrow}
            title={t.capital.title}
            {...splitDecimals(money, TOTALS.capital)}
            meta={[
              t.capital.portfolio,
              format(t.capital.clients, { count: TOTALS.clients }),
            ]}
            watermark="E"
            aside={
              <>
                <span className="mb-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/55 uppercase">
                  {t.capital.summary}
                </span>
                <HighlightStat
                  icon={<Users aria-hidden />}
                  label={t.capital.clientsLabel}
                  value={TOTALS.clients}
                />
                <HighlightStat
                  icon={<Building2 aria-hidden />}
                  label={t.capital.propertiesLabel}
                  value={TOTALS.properties}
                />
                <div className="mt-1 flex items-center justify-between border-t border-white/15 pt-2 text-[10px] tracking-[0.08em] text-white/55">
                  <span className="inline-flex items-center gap-1.5 text-[11px] tracking-normal text-gold-200">
                    <ArrowRight aria-hidden className="size-3.5" />
                    {t.capital.base}
                  </span>
                  <span>EUR</span>
                </div>
              </>
            }
          />

          <MetricGrid label={t.metrics.label}>
            <MetricCard
              icon={<Users aria-hidden />}
              tone="green"
              label={t.metrics.clients}
              value={TOTALS.clients}
              caption={t.metrics.clientsCaption}
            />
            <MetricCard
              icon={<Building2 aria-hidden />}
              tone="gold"
              label={t.metrics.properties}
              value={TOTALS.properties}
              caption={t.metrics.propertiesCaption}
            />
            <MetricCard
              icon={<FileText aria-hidden />}
              tone="blue"
              label={t.metrics.contracted}
              value={money.format(TOTALS.contracted)}
              caption={t.metrics.contractedCaption}
            />
            <MetricCard
              icon={<WalletCards aria-hidden />}
              tone="sage"
              label={t.metrics.received}
              value={money.format(TOTALS.received)}
              caption={t.metrics.receivedCaption}
            />
          </MetricGrid>

          <PortfolioTable
            money={money}
            t={t.portfolio}
            onOpen={openClient}
            onViewAll={() =>
              setNotice(
                format(t.portfolio.viewAllDone, { count: TOTALS.clients }),
              )
            }
          />
        </>
      )}
    </div>
  );
}

function PortfolioTable({
  money,
  t,
  onOpen,
  onViewAll,
}: {
  money: Intl.NumberFormat;
  t: Dictionary["overview"]["portfolio"];
  onOpen: (client: PortfolioClient) => void;
  onViewAll: () => void;
}) {
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState<Profile | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [ascending, setAscending] = useState<boolean | null>(null);
  const [page, setPage] = useState(0);

  const term = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    const matches = PORTFOLIO.filter((client) => {
      const text =
        `${client.name} ${t.profiles[client.profile]} ${client.consultant}`.toLowerCase();
      return (
        (!term || text.includes(term)) &&
        (profile === "all" || client.profile === profile)
      );
    });
    return ascending === null
      ? matches
      : [...matches].sort((a, b) =>
          ascending ? a.capital - b.capital : b.capital - a.capital,
        );
  }, [term, profile, ascending, t.profiles]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const from = filtered.length ? page * PAGE_SIZE + 1 : 0;
  const to = Math.min((page + 1) * PAGE_SIZE, filtered.length);

  const openButton = (client: PortfolioClient) => (
    <button
      type="button"
      aria-label={format(t.openClient, { name: client.name })}
      onClick={() => onOpen(client)}
      className={`${buttonClass("ghost", "icon")} text-ink-muted`}
    >
      <MoreHorizontal aria-hidden />
    </button>
  );
  const identity = (client: PortfolioClient) => (
    <div className="flex min-w-36 items-center gap-2.5">
      <InitialsBadge initials={initialsOf(client.name)} />
      <span className="flex flex-col gap-0.5">
        <strong className="text-[13px] font-semibold text-ink-soft">
          {client.name}
        </strong>
        <small className="text-xs text-ink-faint">
          {t.statuses[client.status]}
        </small>
      </span>
    </div>
  );
  const badge = (client: PortfolioClient) => (
    <span className="inline-flex items-center rounded-md border border-line bg-[#f5f8f5] px-2 py-1 text-xs whitespace-nowrap text-ink-soft">
      {t.profiles[client.profile]}
    </span>
  );
  const empty = (
    <div className="flex min-h-28 flex-col items-center justify-center gap-1.5 text-[13px] text-ink-muted">
      <Search aria-hidden className="size-[18px] text-ink-faint" />
      <strong className="text-sm text-ink-soft">{t.empty}</strong>
      <span>{t.emptyHint}</span>
    </div>
  );

  return (
    <SectionCard
      className="mt-5"
      kicker={t.kicker}
      title={t.title}
      titleId="portfolio-heading"
      description={t.description}
      actions={
        <button
          type="button"
          className={buttonClass("outline", "sm")}
          onClick={onViewAll}
        >
          <Users aria-hidden />
          {t.viewAll}
        </button>
      }
    >
      <div className="flex flex-col gap-2 pb-2.5 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-line px-2.5 text-ink-faint focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-600/10 sm:w-80">
          <Search aria-hidden className="size-4 shrink-0" />
          <span className="sr-only">{t.search}</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full min-w-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
          />
        </label>
        <div className="flex gap-2 max-sm:[&>*]:flex-1">
          <button
            type="button"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((open) => !open)}
            className={buttonClass("outline", "sm")}
          >
            <Filter aria-hidden />
            {t.filters}
          </button>
          <button
            type="button"
            aria-label={ascending === false ? t.sortAsc : t.sortDesc}
            onClick={() => {
              setAscending((value) => (value === null ? false : !value));
              setPage(0);
            }}
            className={buttonClass("outline", "sm")}
          >
            <ArrowDownUp aria-hidden />
            {t.sort}
          </button>
        </div>
      </div>

      {filterOpen ? (
        <div className="mb-2.5 flex flex-wrap items-center gap-2.5 rounded-lg border border-line-soft bg-[#fafcfb] p-2.5">
          <label htmlFor="profile-filter" className="text-xs text-ink-muted">
            {t.profileFilter}
          </label>
          <select
            id="profile-filter"
            value={profile}
            onChange={(event) => {
              setProfile(event.target.value as Profile | "all");
              setPage(0);
            }}
            className={`${inputClass} h-8 w-auto min-w-44 flex-1 py-0 text-[13px] sm:flex-none`}
          >
            <option value="all">{t.allProfiles}</option>
            {PROFILES.map((option) => (
              <option key={option} value={option}>
                {t.profiles[option]}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={buttonClass("ghost", "sm")}
            onClick={() => {
              setProfile("all");
              setSearch("");
              setPage(0);
            }}
          >
            {t.clearFilters}
          </button>
        </div>
      ) : null}

      <div className={`${tableClass.wrapper} max-lg:hidden`}>
        <table className={tableClass.table}>
          <thead className={tableClass.head}>
            <tr>
              <th className={tableClass.th}>{t.columns.client}</th>
              <th className={tableClass.th}>{t.columns.profile}</th>
              <th className={tableClass.th}>{t.columns.consultant}</th>
              <th className={tableClass.th}>{t.columns.capital}</th>
              <th className={tableClass.th}>{t.columns.contract}</th>
              <th className={tableClass.th}>{t.columns.balance}</th>
              <th className={tableClass.th}>
                <span className="sr-only">{t.columns.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((client) => (
              <tr key={client.name} className={tableClass.row}>
                <td className={tableClass.td}>{identity(client)}</td>
                <td className={tableClass.td}>{badge(client)}</td>
                <td className={tableClass.td}>{client.consultant}</td>
                <td
                  className={`${tableClass.td} font-semibold whitespace-nowrap text-brand-700`}
                >
                  {money.format(client.capital)}
                </td>
                <td className={`${tableClass.td} whitespace-nowrap`}>
                  {money.format(client.contract)}
                </td>
                <td
                  className={`${tableClass.td} font-semibold whitespace-nowrap text-gold-700`}
                >
                  {money.format(client.balance)}
                </td>
                <td className={`${tableClass.td} w-10`}>
                  {openButton(client)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? empty : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:hidden">
        {visible.map((client) => (
          <article
            key={client.name}
            className="rounded-lg border border-line-soft p-3"
          >
            <div className="flex items-center justify-between gap-2">
              {identity(client)}
              {openButton(client)}
            </div>
            <dl className="mt-2.5 grid grid-cols-2 gap-2.5 border-t border-line-soft pt-2.5 text-xs text-ink-soft">
              {[
                [t.columns.profile, t.profiles[client.profile]],
                [t.columns.consultant, client.consultant],
                [t.columns.capital, money.format(client.capital)],
                [t.columns.contract, money.format(client.contract)],
                [t.columns.balance, money.format(client.balance)],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-[11px] text-ink-faint">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
        {visible.length === 0 ? (
          <div className="sm:col-span-2">{empty}</div>
        ) : null}
      </div>

      <div className="flex min-h-12 flex-col gap-2 py-2.5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <span>{format(t.showing, { from, to, total: filtered.length })}</span>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            aria-label={t.previous}
            disabled={page === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            className={buttonClass("outline", "icon")}
          >
            <ChevronLeft aria-hidden />
          </button>
          <span>{format(t.page, { page: page + 1, pages })}</span>
          <button
            type="button"
            aria-label={t.next}
            disabled={page + 1 >= pages}
            onClick={() =>
              setPage((current) => Math.min(pages - 1, current + 1))
            }
            className={buttonClass("outline", "icon")}
          >
            <ChevronRight aria-hidden />
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

/** Ficha demonstrativa de um cliente da carteira. */
function ClientRecord({
  client,
  money,
  t,
  onBack,
}: {
  client: PortfolioClient;
  money: Intl.NumberFormat;
  t: Dictionary["overview"];
  onBack: () => void;
}) {
  const fields = [
    [t.portfolio.columns.profile, t.portfolio.profiles[client.profile]],
    [t.portfolio.columns.consultant, client.consultant],
    [t.portfolio.columns.capital, money.format(client.capital)],
    [t.portfolio.columns.contract, money.format(client.contract)],
    [t.portfolio.columns.balance, money.format(client.balance)],
  ];
  return (
    <section className="flex min-h-96 flex-col items-start justify-center rounded-xl border border-line bg-white p-6 sm:p-9">
      <span className="mb-5 grid size-11 place-items-center rounded-xl bg-[#edf4ef] text-brand-700">
        <UserRound aria-hidden className="size-5" />
      </span>
      <span className="text-[11px] font-semibold tracking-[0.15em] text-gold-600 uppercase">
        {t.client.kicker}
      </span>
      <h1 className="mt-2 mb-2 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
        {client.name}
      </h1>
      <p className="text-sm text-ink-muted">{t.client.description}</p>
      <dl className="my-6 grid w-full max-w-3xl grid-cols-2 gap-2.5 md:grid-cols-3">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className="flex min-h-16 flex-col justify-center gap-1.5 rounded-lg border border-line-soft bg-[#fafcfb] px-3 py-2.5"
          >
            <dt className="text-[11px] text-ink-faint">{label}</dt>
            <dd className="text-[13px] font-semibold text-ink-soft">{value}</dd>
          </div>
        ))}
      </dl>
      <button type="button" className={buttonClass("outline")} onClick={onBack}>
        <ChevronLeft aria-hidden />
        {t.client.back}
      </button>
    </section>
  );
}
