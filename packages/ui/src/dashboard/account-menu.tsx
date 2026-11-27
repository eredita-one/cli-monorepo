"use client";

import { type Locale, localeNames } from "@repo/i18n/config";
import { ChevronDown, ChevronRight, Globe2, LogOut } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { LanguageDialog, useRouteLocale } from "./language-dialog";
import { popoverClass } from "./styles";
import { useDismiss } from "./use-dismiss";

export type AccountLink = { label: string; href: string; icon?: ReactNode };

/**
 * Conta no cabeçalho: avatar, nome e um menu com os atalhos do app, o idioma atual (ao
 * clicar, abre um modal com os outros; a troca mantém a página) e o "sair" (Server Action).
 */
export function AccountMenu({
  name,
  email,
  subtitle,
  initials,
  links,
  locale,
  localeCookie,
  logoutAction,
  labels,
}: {
  name: string;
  email: string;
  subtitle?: string;
  initials: string;
  links: AccountLink[];
  locale: Locale;
  localeCookie: string;
  logoutAction: (formData: FormData) => Promise<void>;
  labels: {
    account: string;
    language: string;
    chooseLanguage: string;
    close: string;
    logout: string;
    loggingOut: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDialogElement>(null);
  useDismiss(boxRef, open, () => setOpen(false));
  const { currentLocale } = useRouteLocale(locale);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-label={labels.account}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-gold-400 sm:pr-2"
      >
        <Avatar initials={initials} />
        <span className="hidden max-w-40 flex-col gap-0.5 lg:flex">
          <strong className="truncate text-xs font-semibold text-ink-soft">{name}</strong>
          <small className="truncate text-[11px] text-ink-faint">{subtitle ?? email}</small>
        </span>
        <ChevronDown aria-hidden className="hidden size-3.5 text-ink-faint lg:block" />
      </button>

      {open ? (
        <div className={`${popoverClass} w-72 max-w-[calc(100vw-1.5rem)] p-2`}>
          <div className="mb-1 flex items-center gap-2.5 border-b border-line-soft px-2 pt-2 pb-3">
            <Avatar initials={initials} />
            <span className="flex min-w-0 flex-col gap-0.5">
              <strong className="truncate text-[13px] font-semibold text-ink">{name}</strong>
              <small className="truncate text-xs text-ink-muted">{email}</small>
            </span>
          </div>

          {links.length > 0 ? (
            <ul className="border-b border-line-soft pb-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-md px-2 py-2 text-[13px] text-ink-soft hover:bg-canvas hover:text-brand-700 [&_svg]:size-4"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="border-b border-line-soft py-1">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => languageRef.current?.showModal()}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-ink-soft hover:bg-canvas hover:text-ink"
            >
              <Globe2 aria-hidden className="size-4" />
              <span className="flex-1">{labels.language}</span>
              <span lang={currentLocale} className="font-medium text-ink">
                {localeNames[currentLocale]}
              </span>
              <ChevronRight aria-hidden className="size-4 text-ink-faint" />
            </button>
          </div>

          <LanguageDialog
            dialogRef={languageRef}
            locale={locale}
            localeCookie={localeCookie}
            labels={{ title: labels.chooseLanguage, close: labels.close }}
            onChoose={() => setOpen(false)}
          />

          <form action={logoutAction} className="pt-1">
            <input type="hidden" name="lang" value={currentLocale} />
            <LogoutItem label={labels.logout} pendingLabel={labels.loggingOut} />
          </form>
        </div>
      ) : null}
    </div>
  );
}

function LogoutItem({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[13px] text-[#9a5e51] hover:bg-[#fbf3f1] disabled:opacity-60"
    >
      <LogOut aria-hidden className="size-4" />
      {pending ? pendingLabel : label}
    </button>
  );
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <span
      aria-hidden
      className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-[#eaf1ec] text-[11px] font-bold text-brand-700"
    >
      {initials}
    </span>
  );
}
