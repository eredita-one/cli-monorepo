"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/types";

const inputClass =
  "block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm shadow-xs placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500";

export function LoginForm({
  labels,
}: {
  labels: Dictionary["login"]["form"];
}) {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Apenas visual: a autenticação ainda não foi implementada.
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
            className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
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
          className="size-4 rounded border-zinc-300 accent-emerald-700"
        />
        {labels.remember}
      </label>

      <button
        type="submit"
        className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        {labels.submit}
      </button>
    </form>
  );
}
