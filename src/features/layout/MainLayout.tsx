
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Users, CalendarDays } from "lucide-react";

import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { supabase } from "../../lib/supabase";
import { clearAuth } from "../auth/authSlice";

const navigation = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Patients",
    path: "/patients",
    icon: Users,
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
  },
];

export default function MainLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      dispatch(clearAuth());

      toast.success("Signed out successfully");

      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } shrink-0 bg-[#103B46] text-white transition-all duration-300 p-5 flex flex-col`}
      >
        <h1 className="mb-10 text-2xl font-bold">
          {sidebarOpen ? "Vitala." : "V."}
        </h1>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 transition ${
                    isActive
                      ? "bg-teal-700 text-white"
                      : "text-slate-300 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={20} />

                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 hover:bg-white/10"
        >
          <LogOut size={20} />
          {sidebarOpen && "Logout"}
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Healthcare Management
          </div>

          <div className="text-sm font-medium text-slate-700">
            {user?.email}
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
