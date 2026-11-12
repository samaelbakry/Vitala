import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/store";

export default function PublicRoute() {
  const { session, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-teal-700 border-t-transparent" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
