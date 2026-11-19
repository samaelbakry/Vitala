import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { navigation } from "@/constants/sibebar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "../../app/store";
import Logo from "../../components/ui/Logo";
import { toggleSidebar, toggleTheme } from "../../components/ui/uiSlice";
import { supabase } from "../../lib/supabase";
import { clearAuth } from "../auth/authSlice";
import { clearActiveClinic } from "../clinic/clinicSlice";
import ClinicSwitcher from "../clinic/components/ClinicSwitcher";
import { useActiveClinic } from "../clinic/hooks/useActiveClinic";

export default function MainLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useAppSelector((state) => state.auth.user);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const theme = useAppSelector((state) => state.ui.theme);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "V";

  const { role } = useActiveClinic();

  const visibleNavigation = navigation.filter((item) => {
    if (!item.allowedRoles) return true;

    return role !== null && item.allowedRoles.includes(role);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("vitala-theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      queryClient.clear();

      dispatch(clearAuth());
      dispatch(clearActiveClinic());

      toast.success("Signed out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to sign out");
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-clip bg-background text-foreground">
      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full bg-brand-300/10 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-40 right-0 h-96 w-96 rounded-full bg-brand-700/10 blur-[130px]" />

      <aside
        className={`${
          sidebarOpen ? "w-[260px]" : "w-[76px]"
        } sticky top-0 z-30 flex max-h-screen shrink-0 flex-col border-r border-white/[0.08] bg-brand-950/95 text-brand-100 shadow-[8px_0_40px_rgba(5,31,32,0.08)] backdrop-blur-2xl transition-[width] duration-300 ease-in-out`}
      >
        <div className="flex h-[76px] items-center border-b border-white/[0.08] px-5">
          {sidebarOpen && <Logo light />}
          {!sidebarOpen && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700/60 text-sm font-medium text-brand-100">
              V
            </div>
          )}
        </div>

        <ClinicSwitcher sidebarOpen={sidebarOpen} />

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {sidebarOpen && (
            <p className="mb-4 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-300/50">
              Workspace
            </p>
          )}

          {visibleNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                title={!sidebarOpen ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition-all duration-200 ${
                    isActive
                      ? "bg-brand-700/50 text-brand-100 shadow-[inset_0_0_0_1px_rgba(142,182,155,0.12)]"
                      : "text-brand-300/80 hover:bg-white/[0.05] hover:text-brand-100"
                  } ${!sidebarOpen ? "justify-center" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-brand-300" />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={1.7}
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

        <div className="border-t border-white/[0.08] p-3">
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-brand-300/80 transition-all hover:bg-red-400/10 hover:text-red-300 ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut size={19} strokeWidth={1.7} className="shrink-0" />
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-border/70 bg-background/65 px-5 backdrop-blur-2xl lg:px-9">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleSidebar())}
              aria-label="Toggle sidebar"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-accent/70 hover:text-foreground"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={19} strokeWidth={1.6} />
              ) : (
                <PanelLeftOpen size={19} strokeWidth={1.6} />
              )}
            </Button>

            <div className="h-5 w-px bg-border/80" />

            <span className="hidden text-[11px] font-medium tracking-[0.16em] text-muted-foreground sm:block">
              HEALTHCARE MANAGEMENT
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleTheme())}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              title={theme === "light" ? "Dark mode" : "Light mode"}
              className="h-9 w-9 rounded-xl border border-border/60 bg-card/50 text-muted-foreground shadow-sm backdrop-blur-xl transition-all hover:bg-accent hover:text-foreground"
            >
              {theme === "light" ? (
                <Moon size={17} strokeWidth={1.7} />
              ) : (
                <Sun size={17} strokeWidth={1.7} />
              )}
            </Button>

            <div className="h-7 w-px bg-border/70" />

            <div className="flex items-center gap-3">
              <span className="hidden max-w-48 truncate text-[13px] text-muted-foreground md:block">
                {user?.email}
              </span>

              <div
                title={user?.email}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-300/30 bg-brand-300/20 text-sm font-medium text-brand-800 dark:text-brand-100"
              >
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 p-5 sm:p-7 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
