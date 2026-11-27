import type { Locale } from "@repo/i18n/config";
import { format } from "@repo/i18n/format";
import { sharedMessages } from "@repo/i18n/messages";
import { PageHeading, SectionCard } from "./dashboard/blocks";

/** Página de demonstração dos apps que ainda não têm conteúdo: prova que o login funciona. */
export function DemoView({
  locale,
  user,
  areas,
}: {
  locale: Locale;
  user: { name: string; email: string };
  /** Nomes das áreas/apps a que a pessoa tem acesso (opcional). */
  areas?: string[];
}) {
  const t = sharedMessages[locale].demo;

  return (
    <div className="max-w-3xl">
      <PageHeading
        kicker={t.badge}
        title={format(t.greeting, { name: user.name })}
        description={t.body}
      />

      <SectionCard title={t.sessionTitle} titleId="demo-session" className="pb-5">
        <dl className="mt-2 space-y-3 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-ink-muted">{t.email}:</dt>
            <dd className="font-medium text-ink-soft">{user.email}</dd>
          </div>
          {areas && areas.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <dt className="text-ink-muted">{t.apps}:</dt>
              {areas.map((area) => (
                <dd
                  key={area}
                  className="rounded-md border border-line bg-[#f5f8f5] px-2 py-0.5 text-xs font-medium text-ink-soft"
                >
                  {area}
                </dd>
              ))}
            </div>
          ) : null}
        </dl>
      </SectionCard>
    </div>
  );
}
