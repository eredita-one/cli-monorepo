"use client";

import type { PasswordFormState } from "@repo/auth/config";
import { format } from "@repo/i18n/format";
import type { PasswordErrorCode } from "@repo/i18n/messages";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { useActionState, useId } from "react";
import { buttonClass, inputClass } from "../dashboard/styles";

export type ChangePasswordLabels = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  submit: string;
  submitting: string;
  success: string;
  errors: Record<PasswordErrorCode, string>;
};

/**
 * Troca da própria senha. A Server Action vem do app (cada app tem a sua sessão). Funciona
 * sem JavaScript; com ele, mostra "trocando…". Depois do envio o React limpa os campos, o
 * que é o desejado para senhas.
 */
export function ChangePasswordForm({
  action,
  locale,
  email,
  minLength,
  labels,
}: {
  action: (state: PasswordFormState, formData: FormData) => Promise<PasswordFormState>;
  locale: string;
  /** Vai num campo oculto: o gerenciador de senhas sabe de qual conta é a senha nova. */
  email: string;
  minLength: number;
  labels: ChangePasswordLabels;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const id = useId();

  const fields = [
    { name: "currentPassword", label: labels.currentPassword, autoComplete: "current-password" },
    { name: "newPassword", label: labels.newPassword, autoComplete: "new-password", minLength },
    { name: "confirmPassword", label: labels.confirmPassword, autoComplete: "new-password", minLength },
  ];

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <input type="hidden" name="lang" value={locale} />
      <input
        type="text"
        name="username"
        autoComplete="username"
        value={email}
        readOnly
        hidden
      />
      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <label htmlFor={`${id}-${field.name}`} className="block text-[13px] font-medium text-ink-soft">
            {field.label}
          </label>
          <input
            id={`${id}-${field.name}`}
            type="password"
            name={field.name}
            autoComplete={field.autoComplete}
            minLength={field.minLength}
            maxLength={256}
            required
            className={inputClass}
          />
        </div>
      ))}

      {state?.status === "error" ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-800"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {describe(state, labels.errors)}
        </p>
      ) : null}
      {state?.status === "success" ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-[#d9e8dc] bg-[#f1f7f2] px-3 py-2.5 text-[13px] text-[#3f6b4e]"
        >
          <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0" />
          {labels.success}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={`${buttonClass("primary")} disabled:cursor-wait`}>
        {pending ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}

function describe(
  state: Extract<PasswordFormState, { status: "error" }>,
  errors: Record<PasswordErrorCode, string>,
) {
  const template = errors[state.code as PasswordErrorCode] ?? errors.UNKNOWN;
  return format(template, {
    minLength: state.minLength ?? "",
    maxLength: state.maxLength ?? "",
    minutes: Math.max(1, Math.ceil((state.retryAfterSeconds ?? 60) / 60)),
  });
}
