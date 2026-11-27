import "server-only";
import { type ClientUser, sessionEndPath } from "@repo/auth/config";
import { getCurrentClientUser } from "@repo/auth/server";
import { redirect } from "next/navigation";
import { getLocale } from "@/i18n/get-dictionary";
import { AUTH } from "./auth-config";

/**
 * Cliente logado. Sem sessão válida (token recusado pela API), apaga os cookies e
 * volta ao login. Só em Server Components dentro de <Suspense> (lê cookies).
 */
export async function requireUser(): Promise<ClientUser> {
  const user = await getCurrentClientUser(AUTH);
  if (!user) redirect(sessionEndPath(await getLocale()));
  return user;
}
