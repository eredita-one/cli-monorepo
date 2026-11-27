// Configuração de login de cada app. Seguro para proxy, servidor e Client Components.

/** Apps da equipe interna (iguais aos da API). */
export type StaffApp = "ADMIN" | "CONSULTOR" | "CONTABIL";

/** Nome (marca) de cada app da equipe. Não se traduz. */
export const STAFF_APP_NAMES: Record<StaffApp, string> = {
  ADMIN: "Eredità ONE",
  CONSULTOR: "Eredità Partner",
  CONTABIL: "Contábil",
};

export type StaffAuthConfig = {
  realm: "staff";
  app: StaffApp;
  /** Prefixo dos cookies deste app. Cada app tem o seu (no localhost, as portas não separam cookies). */
  cookiePrefix: string;
};

export type ClientAuthConfig = {
  realm: "client";
  cookiePrefix: string;
};

export type AuthConfig = StaffAuthConfig | ClientAuthConfig;

export function cookieNames({ cookiePrefix }: AuthConfig) {
  return {
    access: `${cookiePrefix}-access`,
    refresh: `${cookiePrefix}-refresh`,
    /** Presente quando a pessoa marcou "Manter conectado". */
    persist: `${cookiePrefix}-persist`,
  };
}

/** Rota que apaga a sessão e volta ao login. Fica fora de `[lang]` (o proxy não a intercepta). */
export const SESSION_END_PATH = "/api/session/end";

export function sessionEndPath(locale: string) {
  return `${SESSION_END_PATH}?lang=${encodeURIComponent(locale)}`;
}

/** Quem entrou num app da equipe, como a API devolve em `/auth/staff/me`. */
export type StaffUser = {
  id: string;
  email: string;
  name: string;
  app: StaffApp;
  apps: StaffApp[];
  permissions: string[];
};

/** Quem entrou no portal do cliente (`/auth/client/me`). */
export type ClientUser = {
  id: string;
  email: string;
  name: string;
};

/** Mínimo de caracteres de uma senha nova. É o mesmo da API, que confere de novo. */
export const PASSWORD_MIN_LENGTH = 6;

/**
 * Estado do formulário de troca da própria senha. Em caso de erro, `code` é o código da
 * API (ou `PASSWORD_MISMATCH`, conferido antes de chamar) e os números vêm para a mensagem.
 */
export type PasswordFormState =
  | { status: "success" }
  | {
      status: "error";
      code: string;
      minLength?: number;
      maxLength?: number;
      retryAfterSeconds?: number;
    }
  | null;

/**
 * Estado do formulário de login: `null` antes de enviar ou em caso de sucesso. Em caso de
 * erro, devolve também o que foi digitado: o React 19 limpa o formulário depois do envio,
 * e o e-mail precisa continuar preenchido.
 */
export type LoginFormState = {
  code: string;
  retryAfterSeconds?: number;
  email?: string;
  remember?: boolean;
} | null;
