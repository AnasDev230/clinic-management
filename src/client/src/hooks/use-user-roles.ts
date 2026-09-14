"use client";

import { useAuthStore } from "@/stores/auth-store";

export const ROLE_SUPER_ADMIN = "SuperAdmin";
export const ROLE_ADMIN = "Admin";
export const ROLE_DOCTOR = "Doctor";
export const ROLE_RECEPTIONIST = "Receptionist";

/**
 * Role helpers for UI visibility only. The backend remains the
 * source of truth for authorization (endpoints return 403).
 *
 * When roles are unknown (e.g. after a page reload where only the
 * tokens were restored), everything is shown and the API decides.
 */
export function useUserRoles() {
  const user = useAuthStore((s) => s.user);
  const roles = user?.roles ?? [];
  const unknown = roles.length === 0;

  const hasRole = (...names: string[]) =>
    unknown || names.some((name) => roles.includes(name));

  const canAccess = (allowed: string[]) =>
    allowed.length === 0 || hasRole(...allowed);

  return {
    roles,
    unknown,
    hasRole,
    canAccess,
    isSuperAdmin: unknown || roles.includes(ROLE_SUPER_ADMIN),
    isAdmin:
      unknown || roles.includes(ROLE_ADMIN) || roles.includes(ROLE_SUPER_ADMIN),
    canViewAuditDetail: unknown || roles.includes(ROLE_SUPER_ADMIN),
  };
}
