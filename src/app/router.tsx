import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicRoute from "../features/routes/PublicRoute";
import AuthLayout from "../features/layout/AuthLayout";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../features/routes/ProtectedRoute";
import MainLayout from "../features/layout/MainLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import NoAccessPage from "@/components/shared/NoAccessPage";
import UnauthorizedPage from "@/components/shared/UnauthorizedPage";
import MembershipGuard from "@/features/routes/MembershipGuide";
import RoleGuard from "@/features/routes/RoleGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  // Authentication
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
  // Authenticated routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "no-access",
        element: <NoAccessPage />,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
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
              // Admin + Receptionist
              {
                element: <RoleGuard allowedRoles={["admin", "receptionist"]} />,
                children: [
                  {
                    path: "/patients",
                    element: <h2>cooming soon</h2>,
                  },
                  {
                    path: "/doctors",
                    element: <h2>cooming soon</h2>,
                  },
                ],
              },
              // All roles
               {
                element: <RoleGuard allowedRoles={["admin", "receptionist" , "receptionist"]} />,
                children: [
                  {
                    path: "/appointments",
                    element: <h2>cooming soon</h2>,
                  },
                
                ],
              },

               // Admin + Doctor
                {
                element: (
                  <RoleGuard
                    allowedRoles={["admin", "doctor"]}
                  />
                ),
                children: [
                  {
                    path: "/medical-records",
                    element: <h2>cooming soon</h2>,
                  },
                  {
                    path: "/prescriptions",
                    element: <h2>cooming soon</h2>,
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
