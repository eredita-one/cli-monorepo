"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { popoverClass, topbarIconButton } from "./styles";
import { useDismiss } from "./use-dismiss";

export type DashboardNotification = {
  id: string;
  title: string;
  body: string;
  /** Quando aconteceu, já formatado ("Há 18 minutos"). */
  time: string;
  href?: string;
  tone?: "gold" | "green";
};

/** Sino do cabeçalho. Sem notificações, mostra o aviso de que não há nada novo. */
export function NotificationsButton({
  items,
  labels,
}: {
  items: DashboardNotification[];
  labels: { title: string; empty: string };
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  useDismiss(boxRef, open, () => setOpen(false));

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-label={labels.title}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={topbarIconButton}
      >
        <Bell aria-hidden className="size-[18px]" />
        {items.length > 0 ? (
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-gold-500 ring-2 ring-white" />
        ) : null}
      </button>

      {open ? (
        <div className={`${popoverClass} w-80 max-w-[calc(100vw-2rem)] p-2.5`}>
          <p className="border-b border-line-soft px-1 pt-1 pb-2.5 text-sm font-semibold text-ink">
            {labels.title}
          </p>
          {items.length === 0 ? (
            <p className="px-1 py-5 text-center text-[13px] text-ink-muted">{labels.empty}</p>
          ) : (
            <ul>
              {items.map((item) => {
                const content = (
                  <>
                    <i
                      aria-hidden
                      className={`mt-1.5 size-1.5 shrink-0 rounded-full ${item.tone === "green" ? "bg-brand-500" : "bg-gold-500"}`}
                    />
                    <span className="flex flex-col gap-1">
                      <strong className="text-[13px] font-semibold text-ink-soft">{item.title}</strong>
                      <small className="text-xs text-ink-muted">{item.body}</small>
                      <small className="text-xs text-ink-faint">{item.time}</small>
                    </span>
                  </>
                );
                const rowClass =
                  "flex gap-2.5 border-b border-line-soft px-1 py-3 last:border-0";
                return (
                  <li key={item.id}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`${rowClass} hover:bg-[#fafcfb]`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className={rowClass}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
