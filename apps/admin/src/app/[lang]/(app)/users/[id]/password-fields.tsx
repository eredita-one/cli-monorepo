"use client";

import { KeyRound } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { inputClass } from "@/components/ui";

/**
 * "Definir nova senha" como link: os campos só aparecem ao clicar. Fechado, os campos
 * ficam vazios e a senha não muda. `<details>` funciona até sem JavaScript.
 */
export function PasswordFields({
  minLength,
  labels,
}: {
  minLength: number;
  labels: {
    toggle: string;
    cancel: string;
    hint: string;
    newPassword: string;
    confirm: string;
  };
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const id = useId();

  // Depois de salvar, o formulário volta ao início (`reset`): os campos se escondem de novo.
  useEffect(() => {
    const details = detailsRef.current;
    const form = details?.closest("form");
    if (!details || !form) return;
    const close = () => {
      details.open = false;
    };
    form.addEventListener("reset", close);
    return () => form.removeEventListener("reset", close);
  }, []);

  const fields = [
    { name: "password", label: labels.newPassword },
    { name: "passwordConfirm", label: labels.confirm },
  ];

  return (
    <details
      ref={detailsRef}
      className="group mt-2 border-t border-line-soft pt-4"
      onToggle={(event) => {
        const inputs = event.currentTarget.querySelectorAll("input");
        if (event.currentTarget.open) {
          inputs[0]?.focus();
        } else {
          // Escondido não manda senha: o que foi digitado é descartado.
          for (const input of inputs) input.value = "";
        }
      }}
    >
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 [&::-webkit-details-marker]:hidden">
        <KeyRound aria-hidden className="size-4" />
        <span className="group-open:hidden">{labels.toggle}</span>
        <span className="hidden group-open:inline">{labels.cancel}</span>
      </summary>

      <div className="mt-3 space-y-3">
        <p className="text-[13px] text-ink-muted">{labels.hint}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} htmlFor={`${id}-${field.name}`} className="block space-y-1.5 text-sm font-medium">
              <span>{field.label}</span>
              <input
                id={`${id}-${field.name}`}
                type="password"
                name={field.name}
                minLength={minLength}
                maxLength={256}
                autoComplete="new-password"
                className={inputClass}
              />
            </label>
          ))}
        </div>
      </div>
    </details>
  );
}
