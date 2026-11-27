import { Brand, EreditaMark } from "@repo/ui/brand";

/** Marca: não é traduzida. */
export const BRAND_NAME = "Eredità ONE";

export function AppBrand({ className = "" }: { className?: string }) {
  return (
    <Brand
      name="Eredità"
      product="ONE"
      mark={<EreditaMark />}
      className={className}
    />
  );
}
