"use server";

import type { StaffApp } from "@repo/auth/config";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { adminApi } from "@/lib/admin-api";
import { attempt, localeOf, text } from "@/lib/server";

const permissionsOf = (formData: FormData) => formData.getAll("permissions").map(String);

export async function createProfileAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = localeOf(formData);
  const result = await attempt(locale, () =>
    adminApi.createProfile({
      // A API valida o app (só ADMIN, CONSULTOR ou CONTABIL).
      app: text(formData, "app") as StaffApp,
      name: text(formData, "name"),
      description: text(formData, "description") || undefined,
      permissions: permissionsOf(formData),
    }),
  );
  if (result?.status !== "success") return result;
  redirect(`/${locale}/profiles`);
}

export async function updateProfileAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await attempt(localeOf(formData), () =>
    adminApi.updateProfile(text(formData, "id"), {
      name: text(formData, "name"),
      description: text(formData, "description") || null,
      permissions: permissionsOf(formData),
    }),
  );
  if (result?.status === "success") refresh();
  return result;
}

export async function deleteProfileAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = localeOf(formData);
  const result = await attempt(locale, () => adminApi.deleteProfile(text(formData, "id")));
  if (result?.status !== "success") return result;
  redirect(`/${locale}/profiles`);
}
