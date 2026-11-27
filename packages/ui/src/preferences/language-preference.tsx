"use client";

import { type Locale, localeNames } from "@repo/i18n/config";
import { Globe2 } from "lucide-react";
import { useRef } from "react";
import { LanguageDialog, useRouteLocale } from "../dashboard/language-dialog";
import { buttonClass } from "../dashboard/styles";

/** Idioma atual e o botão que abre o modal de troca (o mesmo do menu da conta). */
export function LanguagePreference({
  locale,
  localeCookie,
  labels,
}: {
  locale: Locale;
  localeCookie: string;
  labels: { current: string; change: string; dialogTitle: string; close: string };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { currentLocale } = useRouteLocale(locale);

  return (
    <div className="mt-1 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line-soft bg-[#fafcfb] px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf4ef] text-brand-700">
          <Globe2 aria-hidden className="size-[18px]" />
        </span>
        <span className="flex flex-col gap-0.5">
          <small className="text-[11px] text-ink-faint">{labels.current}</small>
          <strong lang={currentLocale} className="text-[13px] font-semibold text-ink-soft">
            {localeNames[currentLocale]}
          </strong>
        </span>
      </div>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className={buttonClass("outline", "sm")}
      >
        {labels.change}
      </button>
      <LanguageDialog
        dialogRef={dialogRef}
        locale={locale}
        localeCookie={localeCookie}
        labels={{ title: labels.dialogTitle, close: labels.close }}
      />
    </div>
  );
}
