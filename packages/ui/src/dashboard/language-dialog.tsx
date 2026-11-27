"use client";

import { writeLocaleCookie } from "@repo/i18n/client";
import { hasLocale, type Locale, localeNames, locales } from "@repo/i18n/config";
import { Globe2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type RefObject, useId } from "react";

/** Idioma da página atual e o resto do caminho (para trocar de idioma sem sair dela). */
export function useRouteLocale(fallback: Locale) {
  // pathname = "/<idioma>/resto/da/rota"
  const [, segment, ...rest] = usePathname().split("/");
  return {
    currentLocale: hasLocale(segment) ? segment : fallback,
    restPath: rest.length > 0 ? `/${rest.join("/")}` : "",
  };
}

/**
 * Modal de troca de idioma (`<dialog>` nativo: foco preso, Esc fecha, fundo escurecido).
 * Lista só os outros idiomas; a escolha grava o cookie do app e abre a mesma página no
 * idioma novo. Quem usa guarda a ref e abre com `dialogRef.current?.showModal()`.
 */
export function LanguageDialog({
  dialogRef,
  locale,
  localeCookie,
  labels,
  onChoose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  locale: Locale;
  localeCookie: string;
  labels: { title: string; close: string };
  /** Depois da escolha (ex.: fechar o menu de onde o modal saiu). */
  onChoose?: () => void;
}) {
  const titleId = useId();
  const { currentLocale, restPath } = useRouteLocale(locale);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onKeyDown={(event) => {
        // Esc fecha só o modal: marcado como tratado, um menu por trás o ignora.
        if (event.key === "Escape") {
          event.preventDefault();
          event.currentTarget.close();
        }
      }}
      className="m-auto w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-line bg-white p-0 text-ink shadow-[0_24px_60px_rgb(16_44_32/0.22)] backdrop:bg-brand-950/45"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line-soft py-3 pr-2 pl-4">
        <h2 id={titleId} className="flex items-center gap-2 text-sm font-semibold">
          <Globe2 aria-hidden className="size-4 text-brand-700" />
          {labels.title}
        </h2>
        <button
          type="button"
          aria-label={labels.close}
          onClick={() => dialogRef.current?.close()}
          className="grid size-8 place-items-center rounded-md text-ink-muted hover:bg-canvas hover:text-ink"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>
      <ul className="p-2">
        {locales
          .filter((option) => option !== currentLocale)
          .map((option) => (
            <li key={option}>
              <Link
                href={`/${option}${restPath}`}
                hrefLang={option}
                lang={option}
                onClick={() => {
                  writeLocaleCookie(localeCookie, option);
                  dialogRef.current?.close();
                  onChoose?.();
                }}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-canvas hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-gold-400"
              >
                {localeNames[option]}
                <span className="text-[11px] font-semibold tracking-[0.08em] text-ink-faint uppercase">
                  {option}
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </dialog>
  );
}
