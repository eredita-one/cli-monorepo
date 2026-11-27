import type { StaffApp, StaffUser } from "@repo/auth/config";

// Quais permissões abrem cada seção do painel. Espelha as rotas da API: esconder um link
// é só conforto; quem nega de fato é a API (403), e a página mostra "sem permissão".

const USERS_MANAGE = "admin.access.users.manage";
const PROFILES_MANAGE = "admin.access.profiles.manage";
const CONSULTOR_MANAGE = "admin.access.consultor.manage";
const CONTABIL_MANAGE = "admin.access.contabil.manage";

export const SECTIONS = {
  users: [USERS_MANAGE, CONSULTOR_MANAGE, CONTABIL_MANAGE],
  profiles: [USERS_MANAGE, PROFILES_MANAGE, CONSULTOR_MANAGE, CONTABIL_MANAGE],
  audit: ["admin.access.audit.view"],
} as const;

export function can(user: StaffUser, permission: string) {
  return user.permissions.includes(permission);
}

export function canAny(user: StaffUser, permissions: readonly string[]) {
  return permissions.some((permission) => can(user, permission));
}

export const canCreateUsers = (user: StaffUser) => can(user, USERS_MANAGE);

/** Áreas em que a pessoa pode criar/editar perfis (a API confere o resto). */
export function definableApps(user: StaffUser): StaffApp[] {
  const apps: StaffApp[] = [];
  if (can(user, PROFILES_MANAGE)) apps.push("ADMIN");
  if (can(user, CONSULTOR_MANAGE)) apps.push("CONSULTOR");
  if (can(user, CONTABIL_MANAGE)) apps.push("CONTABIL");
  return apps;
}

/** Área de uma permissão para agrupar na tela: `admin.clients.view` → `clients`. */
export function areaOf(permission: string) {
  return permission.split(".")[1] ?? permission;
}
