import { AlertCircle, Building2 } from "lucide-react";

import { useActiveClinic } from "../hooks/useActiveClinic";
import ClinicProfileForm from "../components/ClinicProfileForm";

export default function ClinicSettingsPage() {
  const { activeClinic, isPending, isError } = useActiveClinic();

  if (isPending) {
    return (
      <div className="mx-auto flex min-h-72 max-w-4xl flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300/30 border-t-brand-700 dark:border-t-brand-300" />
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          Loading clinic workspace...
        </p>
      </div>
    );
  }

  if (isError || !activeClinic) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-foreground">
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
    <div className="mx-auto max-w-5xl space-y-8 pb-4">
      <header className="border-b border-border/60 pb-6">
        <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-brand-700/15 bg-brand-700/5 px-3 py-1 text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-300">
          <Building2 size={14} />
          <span className="text-xs font-medium tracking-wide">
            Workspace settings
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          Clinic settings
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Manage your clinic profile and basic information displayed across your
          workspace.
        </p>
      </header>

      <section className="rounded-2xl border border-border/70 bg-card/80 shadow-xs backdrop-blur-xl">
        <div className="border-b border-border/60 px-6 py-5 sm:px-8">
          <h2 className="text-base font-medium text-foreground">
            Clinic profile
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your clinic&apos;s public and contact details.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <ClinicProfileForm clinic={activeClinic} />
        </div>
      </section>
    </div>
  );
}