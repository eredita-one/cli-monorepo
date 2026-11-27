"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { adminApi } from "@/lib/admin-api";
import { attempt, localeOf, text } from "@/lib/server";

export async function createUserAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = localeOf(formData);
  let createdId = "";
  const result = await attempt(locale, async () => {
    const user = await adminApi.createUser({
      email: text(formData, "email"),
      name: text(formData, "name"),
      profileIds: formData.getAll("profileIds").map(String),
    });
    createdId = user.id;
  });
  if (result?.status !== "success") return result;
  redirect(`/${locale}/users/${createdId}`);
}

export async function grantProfileAction(_state: ActionState, formData: FormData) {
  return mutate(formData, () =>
    adminApi.grantProfile(text(formData, "userId"), text(formData, "profileId")),
  );
}

export async function revokeProfileAction(_state: ActionState, formData: FormData) {
  return mutate(formData, () =>
    adminApi.revokeProfile(text(formData, "userId"), text(formData, "profileId")),
  );
}

export async function setUserStatusAction(_state: ActionState, formData: FormData) {
  const action = text(formData, "action") === "enable" ? "enable" : "disable";
  return mutate(formData, () => adminApi.setStatus(text(formData, "userId"), action));
}

/** Chama a API e, se deu certo, atualiza a tela com os dados novos. */
async function mutate(formData: FormData, call: () => Promise<unknown>) {
  const result = await attempt(localeOf(formData), call);
  if (result?.status === "success") refresh();
  return result;
}
