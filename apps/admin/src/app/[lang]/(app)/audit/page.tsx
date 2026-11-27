import type { StaffApp } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { sharedMessages } from "@repo/i18n/messages";
import { Skeleton } from "@repo/ui/app-shell";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Notice, PageHeader, tableClass } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { type AuditEntry, adminApi } from "@/lib/admin-api";
import { formatDateTime, load } from "@/lib/server";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).audit.title };
}

export default async function AuditPage() {
  const locale = await getLocale();
  const dict = await getDictionary();
  return (
    <div className="space-y-6">
      <PageHeader title={dict.audit.title} description={dict.audit.intro} />
      <Suspense fallback={<Skeleton lines={8} label={sharedMessages[locale].shell.loading} />}>
        <AuditTable locale={locale} />
      </Suspense>
    </div>
  );
}

async function AuditTable({ locale }: { locale: Locale }) {
  const dict = await getDictionary();
  const t = dict.audit;
  const result = await load(() => adminApi.listAudit(100));
  if ("error" in result) return <Notice>{dict.common.noPermission}</Notice>;
  if (result.data.length === 0) return <Notice>{t.empty}</Notice>;

  // Nomes em vez de ids, quando a pessoa também pode listar usuários e perfis.
  const [users, profiles] = await Promise.all([
    load(() => adminApi.listUsers()),
    load(() => adminApi.listProfiles()),
  ]);
  const userNames = new Map("data" in users ? users.data.map((u) => [u.id, u.name]) : []);
  const profileNames = new Map(
    "data" in profiles ? profiles.data.map((p) => [p.id, p.name]) : [],
  );
  const events: Record<string, string> = t.events;

  const subjectOf = (entry: AuditEntry) => {
    const name =
      entry.subjectType === "access_profile"
        ? (profileNames.get(entry.subjectId) ?? stringField(entry, "name"))
        : (userNames.get(entry.subjectId) ?? stringField(entry, "email"));
    return name ?? shortId(entry.subjectId);
  };

  return (
    <div className={tableClass.wrapper}>
      <table className={tableClass.table}>
        <thead className={tableClass.head}>
          <tr>
            <th className={tableClass.th}>{t.when}</th>
            <th className={tableClass.th}>{t.event}</th>
            <th className={tableClass.th}>{t.actor}</th>
            <th className={tableClass.th}>{t.subject}</th>
            <th className={tableClass.th}>{t.details}</th>
          </tr>
        </thead>
        <tbody>
          {result.data.map((entry) => (
            <tr key={entry.id} className={tableClass.row}>
              <td className={`${tableClass.td} whitespace-nowrap text-zinc-600 dark:text-zinc-400`}>
                {formatDateTime(locale, entry.occurredAt)}
              </td>
              <td className={`${tableClass.td} font-medium`}>{events[entry.type] ?? entry.type}</td>
              <td className={tableClass.td}>
                {entry.actorId
                  ? (userNames.get(entry.actorId) ?? shortId(entry.actorId))
                  : dict.common.system}
              </td>
              <td className={tableClass.td}>{subjectOf(entry)}</td>
              <td className={`${tableClass.td} text-zinc-600 dark:text-zinc-400`}>
                {detailsOf(entry, dict, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
    case "AccountLocked":
      return formatDateTime(locale, stringField(entry, "until") ?? null) ?? "";
    default:
      return "";
  }
}
