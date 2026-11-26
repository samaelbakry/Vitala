import { AlertCircle, Building2 } from "lucide-react";

import { useActiveClinic } from "../hooks/useActiveClinic";
import ClinicProfileForm from "../components/ClinicProfileForm";

export default function ClinicSettingsPage() {
  const { activeClinic, isPending, isError } = useActiveClinic();

  if (isPending) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (isError || !activeClinic) {
    return (
      <div className="mx-auto max-w-5xl rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-foreground">
              Unable to load clinic information
            </h2>
            <p className="text-sm text-muted-foreground">
              Please refresh the page or try again in a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-primary">
            WORKSPACE MANAGEMENT
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Clinic Settings
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your clinic profile and contact information.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 size={19} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground">
              Current workspace
            </p>
            <p className="max-w-48 truncate text-sm font-semibold text-foreground">
              {activeClinic.name}
            </p>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="p-5 sm:p-6">
          <ClinicProfileForm clinic={activeClinic} />
        </div>
      </section>
    </div>
  );
}