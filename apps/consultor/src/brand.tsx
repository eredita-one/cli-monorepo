import { Brand, EreditaMark } from "@repo/ui/brand";

/** Marca: não é traduzida. */
export const BRAND_NAME = "Eredità Partner";

export function AppBrand({ className = "" }: { className?: string }) {
  return (
    <Brand
      name="Eredità"
      product="Partner"
      mark={<EreditaMark />}
      className={className}
    />
  );
}
