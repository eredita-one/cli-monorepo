import type { ClientAuthConfig } from "@repo/auth/config";

/**
 * Login deste app: portal do cliente. Outro domínio de login, com tabela e segredo
 * próprios na API: conta da equipe não entra aqui. Seguro para o proxy.
 */
export const AUTH = {
  realm: "client",
  cookiePrefix: "cliente",
} as const satisfies ClientAuthConfig;
