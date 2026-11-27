import type { StaffAuthConfig } from "@repo/auth/config";

/** Login deste app: equipe interna, app CONTABIL. Seguro para o proxy (sem APIs de servidor). */
export const AUTH = {
  realm: "staff",
  app: "CONTABIL",
  cookiePrefix: "contabil",
} as const satisfies StaffAuthConfig;
