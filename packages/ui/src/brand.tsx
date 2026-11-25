/** Nome do produto (provisório). Não é traduzido: é marca. */
export const BRAND_NAME = "Contábil";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid size-9 place-items-center rounded-lg bg-emerald-600 text-white">
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
      <span className="text-lg font-semibold tracking-tight">{BRAND_NAME}</span>
    </div>
  );
}
