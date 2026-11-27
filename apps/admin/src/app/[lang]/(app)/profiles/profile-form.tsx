"use client";

import type { StaffApp } from "@repo/auth/config";
import { useState } from "react";
import { ActionForm } from "@/components/action-form";
import { inputClass } from "@/components/ui";
import type { ActionState } from "@/lib/action-state";

export type CatalogItem = { key: string; app: StaffApp; area: string; label: string };

/**
 * Formulário de perfil (criar e editar). As permissões mostradas são só as do app do
 * perfil, agrupadas por área. Trocar o app (só na criação) limpa a seleção: um perfil
 * nunca mistura permissões de apps diferentes.
 */
export function ProfileForm({
  action,
  locale,
  apps,
  catalog,
  initial,
  labels,
  messages,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  locale: string;
  /** Criação: apps em que a pessoa pode criar perfis. Edição: só o app do perfil. */
  apps: StaffApp[];
  catalog: CatalogItem[];
  initial: { id?: string; app: StaffApp; name: string; description: string; permissions: string[] };
  labels: {
    app: string;
    name: string;
    description: string;
    permissions: string;
    submit: string;
    pending: string;
    saved?: string;
    appNames: Record<StaffApp, string>;
    areaNames: Record<string, string>;
  };
  messages: { errors: Record<string, string>; permissionLabels: Record<string, string> };
}) {
  const [app, setApp] = useState<StaffApp>(initial.app);
  const [selected, setSelected] = useState(() => new Set(initial.permissions));
  const groups = Object.groupBy(
    catalog.filter((item) => item.app === app),
    (item) => item.area,
  );

  function toggle(key: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  return (
    <ActionForm
      action={action}
      hidden={{ lang: locale, ...(initial.id ? { id: initial.id } : {}) }}
      submitLabel={labels.submit}
      pendingLabel={labels.pending}
      successLabel={labels.saved}
      messages={messages}
      className="space-y-6"
    >
      {apps.length > 1 ? (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{labels.app}</legend>
          <div className="flex flex-wrap gap-4">
            {apps.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="app"
                  value={option}
                  checked={app === option}
                  onChange={() => {
                    setApp(option);
                    setSelected(new Set());
                  }}
                  className="size-4 accent-brand-700"
                />
                {labels.appNames[option]}
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <>
          <input type="hidden" name="app" value={app} />
          <p className="text-sm">
            <span className="text-zinc-500">{labels.app}:</span>{" "}
            <span className="font-medium">{labels.appNames[app]}</span>
          </p>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium">
          <span>{labels.name}</span>
          <input
            name="name"
            required
            maxLength={80}
            defaultValue={initial.name}
            className={inputClass}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          <span>{labels.description}</span>
          <input
            name="description"
            maxLength={255}
            defaultValue={initial.description}
            className={inputClass}
          />
        </label>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">
          {labels.permissions} ({selected.size})
        </legend>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(groups).map(([area, items]) => (
            <div key={area} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {labels.areaNames[area] ?? area}
              </p>
              {items?.map((item) => (
                <label key={item.key} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={item.key}
                    checked={selected.has(item.key)}
                    onChange={(event) => toggle(item.key, event.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-brand-700"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </fieldset>
    </ActionForm>
  );
}
