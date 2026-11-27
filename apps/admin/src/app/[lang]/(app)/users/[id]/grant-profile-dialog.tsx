"use client";

import type { StaffApp } from "@repo/auth/config";
import { Plus, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { ActionForm } from "@/components/action-form";
import { buttonClass } from "@/components/ui";
import type { ActionState } from "@/lib/action-state";

export type GrantableProfile = {
  id: string;
  app: StaffApp;
  name: string;
  description: string | null;
};

/**
 * Botão "Atribuir" que abre um modal com os perfis disponíveis (nome e descrição, por
 * área). A pessoa escolhe um e confirma; deu certo, o modal fecha e a página atualiza.
 */
export function GrantProfileDialog({
  action,
  locale,
  userId,
  profiles,
  appNames,
  labels,
  messages,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  locale: string;
  userId: string;
  profiles: GrantableProfile[];
  appNames: Record<StaffApp, string>;
  labels: {
    open: string;
    title: string;
    hint: string;
    submit: string;
    submitting: string;
    noDescription: string;
    close: string;
  };
  messages: { errors: Record<string, string>; permissionLabels?: Record<string, string> };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // Cada abertura começa do zero: sem a escolha nem o erro da vez anterior.
  const [session, setSession] = useState(0);

  const groups = (Object.keys(appNames) as StaffApp[])
    .map((app) => ({ app, items: profiles.filter((profile) => profile.app === app) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setSession((current) => current + 1);
          dialogRef.current?.showModal();
        }}
        className={`${buttonClass.secondary} mt-4`}
      >
        <Plus aria-hidden />
        {labels.open}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-xl border border-line bg-white p-0 text-ink shadow-[0_24px_60px_rgb(16_44_32/0.22)] backdrop:bg-brand-950/45"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line-soft py-4 pr-3 pl-5">
          <div>
            <h2 id={titleId} className="text-base font-semibold">
              {labels.title}
            </h2>
            <p className="mt-0.5 text-[13px] text-ink-muted">{labels.hint}</p>
          </div>
          <button
            type="button"
            aria-label={labels.close}
            onClick={() => dialogRef.current?.close()}
            className="grid size-8 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-canvas hover:text-ink"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        <ActionForm
          key={session}
          action={action}
          hidden={{ lang: locale, userId }}
          submitLabel={labels.submit}
          pendingLabel={labels.submitting}
          messages={messages}
          onSuccess={() => dialogRef.current?.close()}
          className="px-5 pt-4 pb-5"
        >
          <fieldset className="-mx-1 max-h-[min(55vh,28rem)] space-y-4 overflow-y-auto px-1 pb-1">
            <legend className="sr-only">{labels.title}</legend>
            {groups.map((group) => (
              <div key={group.app} className="space-y-1.5">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-faint uppercase">
                  {appNames[group.app]}
                </p>
                {group.items.map((profile) => (
                  <label
                    key={profile.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-line px-3 py-2.5 transition-colors hover:bg-canvas has-checked:border-brand-600 has-checked:bg-brand-50/60"
                  >
                    <input
                      type="radio"
                      name="profileId"
                      value={profile.id}
                      required
                      className="mt-1 accent-brand-700"
                    />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-semibold text-ink">{profile.name}</span>
                      <span className="text-[13px] text-ink-muted">
                        {profile.description || labels.noDescription}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </fieldset>
        </ActionForm>
      </dialog>
    </>
  );
}
