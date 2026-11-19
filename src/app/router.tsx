import NoAccessPage from "@/components/shared/NoAccessPage";
import UnauthorizedPage from "@/components/shared/UnauthorizedPage";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import type { UserRole } from "@/features/auth/types/role.type";
import ClinicSettingsPage from "@/features/clinic/pages/ClinicSettingsPage";
import CreateClinicPage from "@/features/clinic/pages/CreateClinicPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import AuthLayout from "@/features/layout/AuthLayout";
import MainLayout from "@/features/layout/MainLayout";
import MembershipGuard from "@/features/routes/MembershipGuard";
import ProtectedRoute from "@/features/routes/ProtectedRoute";
import PublicRoute from "@/features/routes/PublicRoute";
import RoleGuard from "@/features/routes/RoleGuard";
import { createBrowserRouter, Navigate } from "react-router-dom";

const adminOnly: UserRole[] = ["admin"];
const adminAndDoctor: UserRole[] = ["admin", "doctor"];
const allRoles: UserRole[] = ["admin", "doctor", "receptionist"];
const adminAndReceptionist: UserRole[] = ["admin", "receptionist"];

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/no-access",
        element: <NoAccessPage />,
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "/onboarding",
        element: <CreateClinicPage />,
      },
      {
        element: <MembershipGuard />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "/dashboard",
                element: <DashboardPage />,
              },
              {
                element: <RoleGuard allowedRoles={allRoles} />,
                children: [
                  {
                    path: "/appointments",
                    element: <div>Appointments Page</div>,
                  },
                ],
              },
              {
                element: <RoleGuard allowedRoles={adminAndReceptionist} />,
                children: [
                  {
                    path: "/patients",
                    element: <div>patients Page</div>,
                  },
                  {
                    path: "/doctors",
                    element: <div>Doctors Page</div>,
                  },
                ],
              },

              {
                element: <RoleGuard allowedRoles={adminAndDoctor} />,
                children: [
                  {
                    path: "/medical-records",
                    element: <div>Medical Records Page</div>,
                  },
                  {
                    path: "/prescriptions",
                    element: <div>Prescriptions Page</div>,
                  },
                ],
              },
              {
                element: <RoleGuard allowedRoles={adminOnly} />,
                children: [
                  {
                    path: "/staff",
                    element: <div>Staff Management Page</div>,
                  },
                  {
                    path: "/clinic-settings",
                    element: <ClinicSettingsPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
