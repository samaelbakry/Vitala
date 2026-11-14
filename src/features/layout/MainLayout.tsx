import { navigation } from "@/constants/sibebar";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../app/store";
import Logo from "../../components/ui/Logo";
import { toggleSidebar } from "../../components/ui/uiSlice";
import { supabase } from "../../lib/supabase";
import { clearAuth } from "../auth/authSlice";

export default function MainLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "V";

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
    <div className="min-h-screen bg-[#F5F8F7] text-[#0E2A2B] flex selection:bg-[#3DDC97]/30">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } sticky top-0 h-screen shrink-0 bg-[#0E2A2B] text-white transition-all duration-300 ease-out flex flex-col border-r border-white/10`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {sidebarOpen && <Logo light={true} />}
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5">
          {sidebarOpen && (
            <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6D8B88]">
              Menu
            </p>
          )}

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                title={!sidebarOpen ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-green-400/15 text-green-100"
                      : "text-green-100 hover:bg-white/5 hover:text-white"
                  } ${!sidebarOpen ? "justify-center" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-green-400" />
                    )}
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.25 : 1.75}
                      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                    />
                    {sidebarOpen && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : undefined}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-green-200 hover:bg-rose-500/10 hover:text-rose-300 transition-colors ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} strokeWidth={1.75} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-[#D3DEDB] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleSidebar())}
              aria-label="Toggle sidebar"
              className="p-2 -ml-2 rounded-lg text-[#5B7270] hover:bg-[#E4F7EE]/60 hover:text-[#0E2A2B] transition-colors"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </button>
            <span className="h-4 w-px bg-[#D3DEDB]" />
            <span className="text-xs font-medium uppercase tracking-wider text-[#5B7270]">
              Healthcare Management
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-sm font-medium text-[#37514F]">
              {user?.email}
            </span>
            <div
              title={user?.email}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4F7EE] border border-[#3DDC97]/40 text-sm font-semibold text-[#0F6B5C]"
            >
              {userInitial}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
