import { PASSWORD_MIN_LENGTH, type PasswordFormState } from "@repo/auth/config";
import type { Locale } from "@repo/i18n/config";
import { format } from "@repo/i18n/format";
import { sharedMessages } from "@repo/i18n/messages";
import type { ReactNode } from "react";
import { PageHeading, SectionCard } from "../dashboard/blocks";
import { ChangePasswordForm } from "./change-password-form";
import { LanguagePreference } from "./language-preference";

/**
 * Preferências de quem está logado, igual em todos os apps: os próprios dados (só leitura;
 * quem corrige nome e e-mail é a administração), o idioma e a troca da própria senha.
 */
export function PreferencesView({
  locale,
  localeCookie,
  account,
  changePasswordAction,
}: {
  locale: Locale;
  /** Cookie de idioma do app (gravado ao trocar o idioma). */
  localeCookie: string;
  account: {
    name: string;
    email: string;
    /** Apps/áreas a que a pessoa tem acesso (equipe). */
    areas?: string[];
  };
  /** Server Action do app (chama `changeOwnPassword` do @repo/auth). */
  changePasswordAction: (
    state: PasswordFormState,
    formData: FormData,
  ) => Promise<PasswordFormState>;
}) {
  const t = sharedMessages[locale].preferences;
  const shell = sharedMessages[locale].shell;

  return (
    <div className="max-w-3xl">
      <PageHeading kicker={t.kicker} title={t.title} description={t.description} />

      <div className="space-y-5">
        <SectionCard
          title={t.dataTitle}
          titleId="preferences-data"
          description={t.dataHint}
          className="pb-5"
        >
          <dl className="mt-1 grid gap-2.5 sm:grid-cols-2">
            <Field label={t.name}>{account.name}</Field>
            <Field label={t.email}>{account.email}</Field>
            {account.areas && account.areas.length > 0 ? (
              <Field label={t.areas} wide>
                <span className="flex flex-wrap gap-1.5">
                  {account.areas.map((area) => (
                    <span
                      key={area}
                      className="rounded-md border border-line bg-[#f5f8f5] px-2 py-0.5 text-xs font-medium text-ink-soft"
                    >
                      {area}
                    </span>
                  ))}
                </span>
              </Field>
            ) : null}
          </dl>
        </SectionCard>

        <SectionCard
          title={t.languageTitle}
          titleId="preferences-language"
          description={t.languageHint}
          className="pb-5"
        >
          <LanguagePreference
            locale={locale}
            localeCookie={localeCookie}
            labels={{
              current: t.languageCurrent,
              change: t.languageChange,
              dialogTitle: shell.chooseLanguage,
              close: shell.close,
            }}
          />
        </SectionCard>

        <SectionCard
          title={t.passwordTitle}
          titleId="preferences-password"
          description={format(t.passwordHint, { min: PASSWORD_MIN_LENGTH })}
          className="pb-5"
        >
          <ChangePasswordForm
            action={changePasswordAction}
            locale={locale}
            email={account.email}
            minLength={PASSWORD_MIN_LENGTH}
            labels={{
              currentPassword: t.currentPassword,
              newPassword: t.newPassword,
              confirmPassword: t.confirmPassword,
              submit: t.submit,
              submitting: t.submitting,
              success: t.success,
              errors: t.errors,
            }}
          />
        </SectionCard>
      </div>
    </div>
  );
}

function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex min-h-16 flex-col justify-center gap-1.5 rounded-lg border border-line-soft bg-[#fafcfb] px-3 py-2.5 ${wide ? "sm:col-span-2" : ""}`}
    >
      <dt className="text-[11px] text-ink-faint">{label}</dt>
      <dd className="text-[13px] font-semibold break-all text-ink-soft">{children}</dd>
    </div>
  );
}
