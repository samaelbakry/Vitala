import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F5F8F7] text-[#0E2A2B] flex items-center justify-center p-6 selection:bg-[#3DDC97]/30">
      <div className="relative max-w-md w-full text-center rounded-3xl border border-[#D3DEDB] bg-white p-8 sm:p-10 shadow-sm">
        <div
          className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-[#3DDC97]/15 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F7EE] text-[#0F6B5C] shadow-xs">
          <ShieldAlert className="h-8 w-8" strokeWidth={1.75} />
        </div>

        <span className="auth-display text-6xl font-bold tracking-tight text-[#0F6B5C]">
          403
        </span>

        <h1 className="auth-display mt-3 text-2xl font-bold tracking-tight text-[#0E2A2B]">
          Access Denied
        </h1>

        <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#5B7270]">
          You don&apos;t have the necessary permissions to access this resource. Please contact your administrator if you believe this is a mistake.
        </p>

        <div className="mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#0E2A2B] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#163D3E] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-[#3DDC97]" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}