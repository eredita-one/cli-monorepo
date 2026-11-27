import { Brand } from "@repo/ui/brand";

/** Nome do produto (provisório). Não é traduzido: é marca. */
export const BRAND_NAME = "Contábil";

export function AppBrand({ className }: { className?: string }) {
  return <Brand name={BRAND_NAME} className={className} />;
}
