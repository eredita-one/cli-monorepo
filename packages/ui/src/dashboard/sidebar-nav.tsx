"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { findActiveItem, type NavGroup } from "./menu";
import { useShell } from "./shell";

/**
 * Menu da barra lateral: grupos que abrem e fecham, item atual em destaque. Com a barra
 * recolhida mostra só os ícones (o nome aparece ao passar o mouse).
 */
export function SidebarNav({ groups, label }: { groups: NavGroup[]; label: string }) {
  const pathname = usePathname();
  const { collapsed, closeDrawer } = useShell();
  const active = findActiveItem(groups, pathname);
  // Só guarda o que a pessoa abriu/fechou; o resto segue o padrão do grupo.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  return (
    <nav aria-label={label} className="flex flex-col gap-2">
      {groups.map((group) => {
        const single = group.items.length === 1;
        const open = single || (toggled[group.id] ?? (group.open || active?.group === group.id));
        const panelId = `nav-group-${group.id}`;

        return (
          <section key={group.id}>
            {single ? (
              <span
                className={`block px-2.5 pt-2 pb-1.5 text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase ${collapsed ? "md:hidden" : ""}`}
              >
                {group.label}
              </span>
            ) : (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setToggled((current) => ({ ...current, [group.id]: !open }))}
                className={`flex w-full items-center justify-between rounded-md px-2.5 pt-2 pb-1.5 text-left text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase transition-colors hover:text-white/85 ${collapsed ? "md:hidden" : ""}`}
              >
                <span>{group.label}</span>
                <ChevronDown
                  aria-hidden
                  className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
            )}

            {collapsed ? (
              <span
                title={group.label}
                className="hidden justify-center py-2 text-white/40 md:flex [&_svg]:size-3.5"
              >
                {group.icon}
              </span>
            ) : null}

            <ul
              id={panelId}
              className={`flex-col gap-0.5 ${open ? "flex" : "hidden"} ${collapsed ? "md:flex md:items-center" : ""}`}
            >
              {group.items.map((item) => {
                const current = item.id === active?.id;
                return (
                  <li key={item.id} className={collapsed ? "md:w-11" : ""}>
                    <Link
                      href={item.href}
                      onClick={closeDrawer}
                      aria-current={current ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={`relative flex min-h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-gold-300 ${
                        current
                          ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.05)] [&_svg]:text-gold-300"
                          : "text-white/75 hover:bg-white/7 hover:text-white [&_svg]:text-white/60"
                      } ${collapsed ? "md:justify-center md:px-0" : ""}`}
                    >
                      {current ? (
                        <i
                          aria-hidden
                          className={`absolute inset-y-2 -left-3 w-0.5 rounded-full bg-gold-300 ${collapsed ? "md:-left-[18px]" : ""}`}
                        />
                      ) : null}
                      {item.icon}
                      <span className={`truncate ${collapsed ? "md:sr-only" : ""}`}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
