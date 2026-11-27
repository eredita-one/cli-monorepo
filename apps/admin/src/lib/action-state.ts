/** Resultado das Server Actions do painel, para o formulário mostrar sucesso ou erro. */
export type ActionState =
  | { status: "error"; code: string; details?: unknown }
  | { status: "success" }
  | null;
