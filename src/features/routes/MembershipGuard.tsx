import { Navigate, Outlet } from "react-router-dom";

import { useActiveClinic } from "../clinic/hooks/useActiveClinic";

export default function MembershipGuard() {
  const { hasActiveClinic, isPending, isError, error } = useActiveClinic();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300/30 border-t-brand-700 dark:border-t-brand-300" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium text-foreground">
          Unable to load your clinic membership.
        </p>
        <p className="text-xs text-muted-foreground">{error?.message}</p>
      </div>
    );
  }

  if (!hasActiveClinic) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
