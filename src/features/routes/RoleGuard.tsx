
import { Navigate, Outlet } from "react-router-dom";

import { useActiveClinic } from "@/features/clinic/hooks/useActiveClinic";
import type { UserRole } from "../auth/types/role.type";

export default function RoleGuard({ allowedRoles}: { allowedRoles: UserRole[] }) {
  const {
    role,
    hasActiveClinic,
    isPending,
    isError,
  } = useActiveClinic();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300/30 border-t-brand-700 dark:border-t-brand-300" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Unable to verify your permissions. Please try again.
        </p>
      </div>
    );
  }

  if (!hasActiveClinic) {
    return <Navigate to="/no-access" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
