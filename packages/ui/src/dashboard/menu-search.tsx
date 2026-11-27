"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import type { NavGroup } from "./menu";
import { popoverClass } from "./styles";
import { useDismiss } from "./use-dismiss";

/** Sem acento e em minúsculas, para "imoveis" achar "Imóveis". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/**
 * Busca do cabeçalho: encontra páginas do menu pelo nome (ou pelo grupo) e vai até elas
 * com Enter. Quando houver busca de dados (clientes, imóveis), ela entra aqui.
 */
export function MenuSearch({
  groups,
  labels,
}: {
  groups: NavGroup[];
  labels: { label: string; placeholder: string; empty: string };
}) {
  const router = useRouter();
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  useDismiss(boxRef, open, () => setOpen(false));

  const entries = useMemo(
    () =>
      groups.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          group: group.label,
          haystack: normalize(`${item.label} ${group.label}`),
        })),
      ),
    [groups],
  );
  const term = normalize(query.trim());
  const results = term ? entries.filter((entry) => entry.haystack.includes(term)).slice(0, 8) : [];
  const showList = open && term.length > 0;

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div ref={boxRef} className="relative max-sm:hidden">
      <label className="flex h-9 w-[clamp(12rem,22vw,18rem)] items-center gap-2 rounded-lg border border-line bg-[#fbfcfb] px-2.5 text-ink-faint transition-colors focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-600/10">
        <Search aria-hidden className="size-4 shrink-0" />
        <span className="sr-only">{labels.label}</span>
        <input
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[highlight] ? `${listId}-${highlight}` : undefined}
          value={query}
          placeholder={labels.placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (results.length === 0) return;
              const step = event.key === "ArrowDown" ? 1 : -1;
              setHighlight((current) => (current + step + results.length) % results.length);
            } else if (event.key === "Enter") {
              const target = results[highlight];
              if (target) {
                event.preventDefault();
                go(target.href);
              }
            }
          }}
          className="w-full min-w-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      {showList ? (
        <div className={`${popoverClass} left-0 w-[max(100%,18rem)] p-1.5`}>
          {results.length > 0 ? (
            <ul id={listId} role="listbox" aria-label={labels.label}>
              {results.map((result, index) => (
                <li
                  key={result.id}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === highlight}
                  onPointerEnter={() => setHighlight(index)}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => go(result.href)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] [&_svg]:size-4 ${
                    index === highlight ? "bg-canvas text-ink" : "text-ink-soft"
                  }`}
                >
                  <span className="text-brand-700">{result.icon}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {result.label}
                    <small className="ml-2 text-xs text-ink-faint">{result.group}</small>
                  </span>
                  {index === highlight ? (
                    <CornerDownLeft aria-hidden className="size-3.5 text-ink-faint" />
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId} className="px-2.5 py-3 text-[13px] text-ink-muted">
              {labels.empty}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
