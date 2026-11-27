import type { StaffAuthConfig } from "@repo/auth/config";

/** Login deste app: equipe interna, app CONSULTOR. Seguro para o proxy (sem APIs de servidor). */
export const AUTH = {
  realm: "staff",
  app: "CONSULTOR",
  cookiePrefix: "consultor",
} as const satisfies StaffAuthConfig;
