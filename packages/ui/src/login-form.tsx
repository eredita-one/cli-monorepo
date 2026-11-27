"use client";

import type { LoginFormState } from "@repo/auth/config";
import { format } from "@repo/i18n/format";
import { type AuthErrorCode, isAuthErrorCode } from "@repo/i18n/messages";
import { useActionState, useState } from "react";

const inputClass =
  "block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-xs placeholder:text-zinc-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500";

type Labels = {
  email: string;
  emailPlaceholder: string;
  password: string;
  forgotPassword: string;
  show: string;
  hide: string;
  showPassword: string;
  hidePassword: string;
  remember: string;
  submit: string;
  submitting: string;
};

/**
 * Formulário de login de todos os apps. Recebe a Server Action do app (que sabe em qual
 * app/domínio entrar) e mostra o erro pelo código devolvido pela API.
 * Funciona sem JavaScript também (envio comum de formulário).
 */
export function LoginForm({
  action,
  locale,
  labels,
  errors,
}: {
  action: (state: LoginFormState, formData: FormData) => Promise<LoginFormState>;
  locale: string;
  labels: Labels;
  errors: Record<AuthErrorCode, string>;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [showPassword, setShowPassword] = useState(false);
  const message = state ? errorMessage(state, errors) : null;

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="lang" value={locale} />

      {message ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
        >
          {message}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.email ?? ""}
          placeholder={labels.emailPlaceholder}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium">
            {labels.password}
          </label>
          {/* Rota de recuperação de senha ainda não existe. */}
          <a
            href="#"
            className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
          >
            {labels.forgotPassword}
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${inputClass} pr-20`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? labels.hidePassword : labels.showPassword}
            className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {showPassword ? labels.hide : labels.show}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="remember"
          value="1"
          defaultChecked={state?.remember ?? false}
          className="size-4 rounded border-zinc-300 accent-brand-700"
        />
        {labels.remember}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}

function errorMessage(
  state: NonNullable<LoginFormState>,
  errors: Record<AuthErrorCode, string>,
) {
  const code = isAuthErrorCode(state.code) ? state.code : "UNKNOWN";
  const minutes = Math.max(1, Math.ceil((state.retryAfterSeconds ?? 60) / 60));
  return format(errors[code], { minutes });
}
