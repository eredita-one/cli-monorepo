"use server";

import type { LoginFormState } from "@repo/auth/config";
import { loginWithPassword, logout } from "@repo/auth/server";
import { defaultLocale, hasLocale } from "@repo/i18n/config";
import { redirect } from "next/navigation";
import { AUTH } from "./auth-config";

// `next/root-params` não funciona em Server Actions: o idioma vem num campo do formulário.
function localeOf(formData: FormData) {
  const value = formData.get("lang");
  return typeof value === "string" && hasLocale(value) ? value : defaultLocale;
}

export async function loginAction(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const error = await loginWithPassword(AUTH, {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    remember: formData.get("remember") === "1",
  });
  if (error) return error;
  redirect(`/${localeOf(formData)}`);
}

export async function logoutAction(formData: FormData) {
  await logout(AUTH);
  redirect(`/${localeOf(formData)}/login`);
}
