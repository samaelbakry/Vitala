import { Navigate, Outlet } from "react-router-dom";

import { useMyMemberships } from "@/features/auth/hooks/useMyMemberships";
import type { UserRole } from "../auth/types/role.type";

interface RoleGuardProps { allowedRoles: UserRole[]}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {

  const { data: memberships } = useMyMemberships();

  const hasPermission = memberships?.some((membership) => allowedRoles.includes(membership.role));

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}