import type { UserRole } from "@/features/auth/types/role.type";

export const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  doctor: "Doctor",
  receptionist: "Receptionist",
};

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]):boolean {
  return allowedRoles.includes(userRole);
}