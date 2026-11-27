import type { ReactNode } from "react";

/**
 * Marca do app: símbolo + nome (+ produto, opcional). Cada app passa a sua; o nome não é
 * traduzido (é marca). As cores vêm dos tokens `brand-*` definidos no globals.css do app.
 */
export function Brand({
  name,
  product,
  mark,
  className = "",
}: {
  name: string;
  /** Segunda parte do nome, mais leve (ex.: "Eredità" + "ONE"). */
  product?: string;
  /** Símbolo; sem ele, usa o símbolo padrão (gráfico de barras). */
  mark?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {mark ?? <ChartMark />}
      <span className="text-lg font-semibold tracking-tight">
        {name}
        {product ? <span className="ml-1.5 font-normal opacity-75">{product}</span> : null}
      </span>
    </div>
  );
}

function ChartMark() {
  return (
    <span className="grid size-9 place-items-center rounded-lg bg-brand-600 text-white">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    </span>
  );
}

/** Símbolo da Eredità: "E" em serifa, dourado sobre verde (paleta dos protótipos). */
export function EreditaMark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 place-items-center rounded-lg bg-brand-800 font-serif text-xl font-semibold text-[#e6c58c] ring-1 ring-[#b99a65]/50"
    >
      E
    </span>
  );
}
