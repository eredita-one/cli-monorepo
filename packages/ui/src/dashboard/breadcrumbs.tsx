"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { findActiveItem, type NavGroup } from "./menu";

/** Trilha do cabeçalho: área do app › página atual (tirada do menu). */
export function Breadcrumbs({
  root,
  groups,
  label,
}: {
  root: string;
  groups: NavGroup[];
  label: string;
}) {
  const active = findActiveItem(groups, usePathname());

  return (
    <nav aria-label={label} className="min-w-0">
      <ol className="flex min-w-0 items-center gap-2 text-[13px] whitespace-nowrap text-ink-muted">
        <li className={active ? "max-sm:hidden" : "truncate"}>{root}</li>
        {active ? (
          <li className="flex min-w-0 items-center gap-2">
            <ChevronRight aria-hidden className="size-3.5 shrink-0 text-ink-faint max-sm:hidden" />
            <strong aria-current="page" className="truncate font-semibold text-ink-soft">
              {active.label}
            </strong>
          </li>
        ) : null}
      </ol>
    </nav>
  );
}
