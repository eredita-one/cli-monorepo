import "server-only";
import type { StaffApp } from "@repo/auth/config";
import { callApiAsUser } from "@repo/auth/server";
import { AUTH } from "@/auth-config";

// Endpoints de gestão de acessos da api-backend (`/admin/*`), chamados em nome de quem
// está logado. Toda regra (quem pode o quê) é da API; aqui só há o transporte.

export type ProfileRef = { id: string; app: StaffApp; name: string };

export type StaffUserRecord = {
  id: string;
  email: string;
  name: string;
  status: "ACTIVE" | "DISABLED";
  invitePending: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  profiles: ProfileRef[];
  apps: StaffApp[];
};

export type AccessProfile = {
  id: string;
  app: StaffApp;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: string[];
  userCount: number;
};

export type PermissionInfo = { key: string; app: StaffApp; description: string };

export type AuditEntry = {
  id: string;
  type: string;
  actorId: string | null;
  subjectType: "staff_user" | "client_account" | "access_profile";
  subjectId: string;
  data: Record<string, unknown>;
  occurredAt: string;
};

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
const api = <T>(path: string, method: Method = "GET", body?: unknown) =>
  callApiAsUser<T>(AUTH, path, { method, body });

/** Ids vêm da URL: codificados para não virarem outro caminho da API. */
const id = encodeURIComponent;

export const adminApi = {
  listUsers: () => api<StaffUserRecord[]>("/admin/staff-users"),
  getUser: (userId: string) => api<StaffUserRecord>(`/admin/staff-users/${id(userId)}`),
  createUser: (body: { email: string; name: string; profileIds: string[] }) =>
    api<StaffUserRecord>("/admin/staff-users", "POST", body),
  grantProfile: (userId: string, profileId: string) =>
    api<StaffUserRecord>(
      `/admin/staff-users/${id(userId)}/access-profiles/${id(profileId)}`,
      "PUT",
    ),
  revokeProfile: (userId: string, profileId: string) =>
    api<StaffUserRecord>(
      `/admin/staff-users/${id(userId)}/access-profiles/${id(profileId)}`,
      "DELETE",
    ),
  setStatus: (userId: string, action: "enable" | "disable") =>
    api<StaffUserRecord>(`/admin/staff-users/${id(userId)}/${action}`, "POST"),

  listProfiles: () => api<AccessProfile[]>("/admin/access-profiles"),
  createProfile: (body: {
    app: StaffApp;
    name: string;
    description?: string;
    permissions: string[];
  }) => api<AccessProfile>("/admin/access-profiles", "POST", body),
  updateProfile: (
    profileId: string,
    body: { name?: string; description?: string | null; permissions?: string[] },
  ) => api<AccessProfile>(`/admin/access-profiles/${id(profileId)}`, "PATCH", body),
  deleteProfile: (profileId: string) =>
    api<void>(`/admin/access-profiles/${id(profileId)}`, "DELETE"),

  listPermissions: () => api<PermissionInfo[]>("/admin/permissions"),
  listAudit: (limit: number) => api<AuditEntry[]>(`/admin/access-audit?limit=${limit}`),
};
