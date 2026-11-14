
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import PublicRoute from "../features/routes/PublicRoute";
import AuthLayout from "../features/layout/AuthLayout";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../features/routes/ProtectedRoute";
import MainLayout from "../features/layout/MainLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login/>,
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
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
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
