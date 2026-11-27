"use client";

import { format } from "@repo/i18n/format";
import {
  type FormEvent,
  type ReactNode,
  startTransition,
  useActionState,
  useEffect,
  useRef,
} from "react";
import type { ActionState } from "@/lib/action-state";
import { buttonClass } from "./ui";

type Messages = {
  /** Mensagem por código de erro da API; `UNKNOWN` é a reserva. `missing` lista permissões. */
  errors: Record<string, string>;
  /** Nome traduzido de cada permissão, para explicar o que falta numa recusa de escalada. */
  permissionLabels?: Record<string, string>;
};

/**
 * Formulário de uma Server Action do painel: mostra "enviando", o sucesso e o erro
 * traduzido pelo código da API. Funciona também sem JavaScript.
 */
export function ActionForm({
  action,
  hidden,
  submitLabel,
  pendingLabel,
  successLabel,
  variant = "primary",
  messages,
  className = "",
  resetOnSuccess = false,
  onSuccess,
  secondaryAction,
  children,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  hidden: Record<string, string>;
  submitLabel: string;
  pendingLabel: string;
  successLabel?: string;
  variant?: keyof typeof buttonClass;
  messages: Messages;
  className?: string;
  /** Depois do sucesso, volta os campos aos valores da página (ex.: limpa senhas). */
  resetOnSuccess?: boolean;
  /** Chamado uma vez a cada sucesso (ex.: fechar o modal). Só de Client Components. */
  onSuccess?: () => void;
  /** Ao lado do botão de enviar (ex.: link "Cancelar"). */
  secondaryAction?: ReactNode;
  children?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  // A função muda a cada render de quem usa; o efeito abaixo só deve rodar quando o
  // estado muda, então guardamos a versão mais recente numa ref.
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  useEffect(() => {
    if (state?.status !== "success") return;
    if (resetOnSuccess) formRef.current?.reset();
    onSuccessRef.current?.();
  }, [state, resetOnSuccess]);

  // O React 19 limpa o formulário ao fim da ação, mesmo quando ela devolve um erro: o
  // e-mail repetido apagaria o que foi digitado. Com JavaScript, despachamos a ação à
  // mão (sem limpeza); sem JavaScript, o `action` faz o envio comum.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={submit} className={`space-y-3 ${className}`}>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass[variant]}>
          {pending ? pendingLabel : submitLabel}
        </button>
        {secondaryAction}
        {state?.status === "success" && successLabel ? (
          <span role="status" className="text-sm text-brand-700 dark:text-brand-400">
            {successLabel}
          </span>
        ) : null}
      </div>
      {state?.status === "error" ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
        >
          {describe(state, messages)}
        </p>
      ) : null}
    </form>
  );
}

function describe(
  state: Extract<ActionState, { status: "error" }>,
  { errors, permissionLabels }: Messages,
) {
  // Números e textos que a API manda em `details` (ex.: `minLength`) entram na mensagem.
  const values = Object.fromEntries(
    Object.entries((state.details ?? {}) as Record<string, unknown>).filter(
      (entry): entry is [string, string | number] =>
        typeof entry[1] === "string" || typeof entry[1] === "number",
    ),
  );
  const message = format(errors[state.code] ?? errors.UNKNOWN ?? state.code, values);
  const missing = (state.details as { missing?: unknown } | undefined)?.missing;
  if (!Array.isArray(missing) || missing.length === 0 || !errors.missing) return message;

  const list = missing
    .map((key) => (typeof key === "string" ? (permissionLabels?.[key] ?? key) : ""))
    .filter(Boolean)
    .join("; ");
  return `${message} ${format(errors.missing, { list })}`;
}
