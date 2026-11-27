import "server-only";
import type { getDictionary } from "@/i18n/get-dictionary";
import { areaOf } from "@/lib/access";
import type { PermissionInfo } from "@/lib/admin-api";
import type { CatalogItem } from "./profile-form";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

/** Catálogo da API com o nome traduzido de cada permissão (a descrição da API é reserva). */
export function buildCatalog(permissions: PermissionInfo[], dict: Dictionary): CatalogItem[] {
  const labels: Record<string, string> = dict.permissions;
  return permissions.map((permission) => ({
    key: permission.key,
    app: permission.app,
    area: areaOf(permission.key),
    label: labels[permission.key] ?? permission.description,
  }));
}

export function profileFormLabels(dict: Dictionary) {
  return {
    app: dict.profiles.app,
    name: dict.profiles.name,
    description: dict.profiles.description,
    permissions: dict.profiles.permissions,
    appNames: dict.common.apps,
    areaNames: dict.profiles.areas as Record<string, string>,
  };
}
