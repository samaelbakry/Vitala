import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
} from "lucide-react";
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
    <div className="relative flex min-h-screen overflow-clip bg-background text-foreground transition-colors duration-300">
      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full bg-brand-300/15 blur-[120px] dark:bg-brand-700/15" />
      <div className="pointer-events-none fixed -bottom-40 right-0 h-96 w-96 rounded-full bg-brand-700/10 blur-[130px] dark:bg-brand-300/10" />

      <aside
        className={`${
          sidebarOpen ? "w-65" : "w-19"
        } sticky top-0 z-30 flex max-h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[8px_0_40px_rgba(15,42,74,0.04)] backdrop-blur-2xl transition-[width] duration-300 ease-in-out`}
      >
        <div className="flex h-19 items-center border-b border-sidebar-border px-5">
          {sidebarOpen && <Logo light={theme === "dark"} />}
          {!sidebarOpen && <Logo light={theme === "dark"} iconOnly />}
        </div>

        <ClinicSwitcher sidebarOpen={sidebarOpen} />

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {sidebarOpen && (
            <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
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
                  `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                  } ${!sidebarOpen ? "justify-center" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={1.7}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isActive ? "text-sidebar-primary" : ""
                      }`}
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

        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut size={19} strokeWidth={1.7} className="shrink-0" />
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-19 items-center justify-between border-b border-border/70 bg-background/75 px-5 backdrop-blur-2xl lg:px-9">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleSidebar())}
              aria-label="Toggle sidebar"
              className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={19} strokeWidth={1.6} />
              ) : (
                <PanelLeftOpen size={19} strokeWidth={1.6} />
              )}
            </Button>

            <div className="h-5 w-px bg-border/80" />

            <span className="hidden text-[11px] font-semibold tracking-[0.16em] text-muted-foreground sm:block">
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
              className="h-9 w-9 rounded-xl border border-border/70 bg-card/70 text-muted-foreground shadow-sm backdrop-blur-xl transition-all hover:bg-accent hover:text-accent-foreground"
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
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-300/40 bg-brand-100 text-sm font-semibold text-brand-900 shadow-sm dark:border-brand-700/50 dark:bg-brand-900/50 dark:text-brand-100"
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