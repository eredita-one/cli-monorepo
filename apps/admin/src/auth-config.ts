import type { StaffAuthConfig } from "@repo/auth/config";

/** Login deste app: equipe interna, app ADMIN. Seguro para o proxy (sem APIs de servidor). */
export const AUTH = {
  realm: "staff",
  app: "ADMIN",
  cookiePrefix: "admin",
} as const satisfies StaffAuthConfig;
