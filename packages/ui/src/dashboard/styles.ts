// Classes do painel reaproveitadas por várias peças. Sem diretiva: vale no servidor e no
// navegador (constantes exportadas de um arquivo "use client" não chegam ao servidor).

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400";

/** Botões de ícone do cabeçalho (menu, notificações, ajuda). */
export const topbarIconButton = `relative grid size-9 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-canvas hover:text-ink ${focusRing}`;

const buttonBase = `inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 ${focusRing}`;

const buttonVariants = {
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  outline: "border border-line bg-white text-ink-soft hover:bg-canvas hover:text-ink",
  ghost: "text-ink-soft hover:bg-canvas hover:text-ink",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
} as const;

const buttonSizes = {
  md: "h-9 px-3.5 text-[13px]",
  sm: "h-8 px-2.5 text-xs",
  icon: "size-8",
} as const;

/** Botão no padrão do painel: `buttonClass("outline", "sm")`. Vale para <button> e <Link>. */
export function buttonClass(
  variant: keyof typeof buttonVariants = "primary",
  size: keyof typeof buttonSizes = "md",
) {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}`;
}

/** Tabela no padrão do painel (cabeçalho em caixa alta, linhas finas). */
export const tableClass = {
  wrapper: "w-full overflow-x-auto",
  table: "w-full border-collapse text-left",
  head: "bg-[#f8faf8]",
  th: "border-y border-line-soft px-3 py-2.5 text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-ink-faint uppercase",
  row: "border-b border-line-soft transition-colors hover:bg-[#fbfcfb]",
  td: "px-3 py-3 align-middle text-[13px] text-ink-muted",
} as const;

/** Campo de texto/seleção no padrão do painel. */
export const inputClass =
  "block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink shadow-xs placeholder:text-ink-faint focus:border-brand-600 focus:ring-3 focus:ring-brand-600/10 focus:outline-none";

/** Caixa dos menus suspensos do cabeçalho. */
export const popoverClass =
  "absolute top-[calc(100%+10px)] right-0 z-50 overflow-hidden rounded-xl border border-line bg-white shadow-[0_16px_38px_rgb(16_44_32/0.12)]";
