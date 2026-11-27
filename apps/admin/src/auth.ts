import "server-only";
import { sessionEndPath, type StaffUser } from "@repo/auth/config";
import { getCurrentStaffUser } from "@repo/auth/server";
import { redirect } from "next/navigation";
import { getLocale } from "@/i18n/get-dictionary";
import { AUTH } from "./auth-config";

/**
 * Quem está logado. Sem sessão válida (token recusado pela API), apaga os cookies e
 * volta ao login. Só em Server Components dentro de <Suspense> (lê cookies).
 */
export async function requireUser(): Promise<StaffUser> {
  const user = await getCurrentStaffUser(AUTH);
  if (!user) redirect(sessionEndPath(await getLocale()));
  return user;
}
