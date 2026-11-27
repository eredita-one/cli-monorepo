import { Brand, EreditaMark } from "@repo/ui/brand";

/** Marca: não é traduzida. */
export const BRAND_NAME = "Eredità Private";

export function AppBrand({ className = "" }: { className?: string }) {
  return (
    <Brand
      name="Eredità"
      product="Private"
      mark={<EreditaMark />}
      className={className}
    />
  );
}
