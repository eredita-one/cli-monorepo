import "server-only";
import { sessionEndPath } from "@repo/auth/config";
import { ApiError } from "@repo/auth/server";
import { defaultLocale, hasLocale, type Locale } from "@repo/i18n/config";
import { redirect } from "next/navigation";
import { getLocale } from "@/i18n/get-dictionary";
import type { ActionState } from "./action-state";

/** Idioma vindo do formulário (`next/root-params` não funciona em Server Actions). */
export function localeOf(formData: FormData): Locale {
  const value = formData.get("lang");
  return typeof value === "string" && hasLocale(value) ? value : defaultLocale;
}

export function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Executa uma chamada à API numa Server Action: sessão vencida volta ao login; qualquer
 * outro erro da API vira estado do formulário (o código é traduzido na tela).
 */
export async function attempt(
  locale: Locale,
  call: () => Promise<unknown>,
): Promise<ActionState> {
  try {
    await call();
    return { status: "success" };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (error.status === 401) redirect(sessionEndPath(locale));
    return { status: "error", code: error.code, details: error.details };
  }
}

/**
 * Carrega dados num Server Component. 401 encerra a sessão; 403 e 404 viram resultado
 * para a página mostrar "sem permissão" ou "não encontrado".
 */
export async function load<T>(
  call: () => Promise<T>,
): Promise<{ data: T } | { error: "forbidden" | "not-found" }> {
  try {
    return { data: await call() };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (error.status === 401) redirect(sessionEndPath(await getLocale()));
    if (error.status === 403) return { error: "forbidden" };
    if (error.status === 404 || error.status === 400) return { error: "not-found" };
    throw error;
  }
}

export function formatDateTime(locale: Locale, iso: string | null) {
  if (!iso) return null;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}
