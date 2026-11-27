import type { Locale } from "@repo/i18n/config";
import { format } from "@repo/i18n/format";
import { sharedMessages } from "@repo/i18n/messages";

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
    <div className="max-w-2xl space-y-8">
      <div className="space-y-3">
        <span className="inline-block rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-200">
          {t.badge}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          {format(t.greeting, { name: user.name })}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t.body}</p>
      </div>

      <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {t.sessionTitle}
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-zinc-500 dark:text-zinc-400">{t.email}:</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          {areas && areas.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <dt className="text-zinc-500 dark:text-zinc-400">{t.apps}:</dt>
              {areas.map((area) => (
                <dd
                  key={area}
                  className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium dark:bg-zinc-800"
                >
                  {area}
                </dd>
              ))}
            </div>
          ) : null}
        </dl>
      </section>
    </div>
  );
}
