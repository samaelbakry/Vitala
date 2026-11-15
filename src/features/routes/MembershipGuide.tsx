import { Navigate, Outlet } from "react-router-dom";

import { useMyMemberships } from "@/features/auth/hooks/useMyMemberships";

export default function MembershipGuard() {
  const {
    data: memberships,
    isPending,
    isError,
    refetch,
  } = useMyMemberships();

  if (isPending) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">
            Failed to load clinic membership.
          </p>

          <button
            onClick={() => refetch()}
            className="rounded-lg bg-teal-700 px-5 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!memberships?.length) {
    return <Navigate to="/no-access" replace />;
  }

  return <Outlet />;
}