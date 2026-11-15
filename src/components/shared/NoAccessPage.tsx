import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Building2, LogOut, RefreshCw } from "lucide-react";

export default function NoAccessPage() {
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      setSigningOut(false);
      toast.error("Unable to sign out");
      return;
    }

    toast.success("Signed out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F5F8F7] text-[#0E2A2B] flex items-center justify-center p-6 selection:bg-[#3DDC97]/30">
      <div className="relative max-w-md w-full text-center rounded-3xl border border-[#D3DEDB] bg-white p-8 sm:p-10 shadow-sm">
        <div
          className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-[#3DDC97]/15 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F7EE] text-[#0F6B5C] shadow-xs">
          <Building2 className="h-8 w-8" strokeWidth={1.75} />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7EE] px-3 py-1 text-xs font-medium text-[#0F6B5C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3DDC97]" />
          Pending Setup
        </span>

        <h1 className="auth-display mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#0E2A2B]">
          No Clinic Assigned
        </h1>

        <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#5B7270]">
          Your account hasn&apos;t been assigned to a clinic yet. Please contact
          your clinic administrator to complete your workspace access.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-[#D3DEDB] bg-white px-6 py-3 text-sm font-semibold text-[#0E2A2B] hover:bg-[#F5F8F7] transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-[#0F6B5C]" />
            Check Access Again
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#0E2A2B] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#163D3E] disabled:opacity-60 transition-colors"
          >
            <LogOut className="h-4 w-4 text-[#3DDC97]" />
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}