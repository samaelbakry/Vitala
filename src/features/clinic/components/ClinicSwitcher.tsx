
import { Building2, Check } from "lucide-react";

import { useAppDispatch } from "@/app/store";
import { useActiveClinic } from "../hooks/useActiveClinic";
import { setActiveClinic } from "../clinicSlice";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClinicSwitcherProps {
  sidebarOpen: boolean;
}

export default function ClinicSwitcher({
  sidebarOpen,
}: ClinicSwitcherProps) {
  const dispatch = useAppDispatch();

  const {
    memberships,
    activeClinic,
    isPending,
    isError,
  } = useActiveClinic();

  if (isPending) {
    return (
      <div className="mx-3 my-4 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-2.5 w-16 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !activeClinic) return null;

  const handleClinicChange = (clinicId: string | null) => {
    if (!clinicId) return;

    dispatch(setActiveClinic(clinicId));
  };

  if (!sidebarOpen) {
    return (
      <div className="flex justify-center px-3 py-5">
        <div
          title={activeClinic.name}
          className="group flex h-11 w-11 items-center justify-center rounded-xl border border-brand-300/20 bg-brand-300/10 text-brand-300 shadow-sm transition-all duration-200 hover:border-brand-300/40 hover:bg-brand-300/20 hover:shadow-brand-300/10"
        >
          <Building2 size={20} strokeWidth={1.7} />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-5">
      <div className="mb-3 flex items-center justify-between px-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300/60">
          Workspace
        </p>

        <span className="rounded-md border border-brand-300/15 bg-brand-300/10 px-2 py-0.5 text-[9px] font-medium tracking-wide text-brand-300/80">
          ACTIVE
        </span>
      </div>

      <Select
        value={activeClinic.name}
        onValueChange={handleClinicChange}
      >
        <SelectTrigger className="group h-auto min-h-[68px] w-full rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-3 text-brand-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all duration-200 hover:border-brand-300/30 hover:bg-white/[0.075] focus:ring-2 focus:ring-brand-300/20 focus:ring-offset-0 [&>svg]:text-brand-300/70">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-300/20 bg-gradient-to-br from-brand-300/20 to-brand-300/5 text-brand-300 shadow-inner transition-all duration-200 group-hover:border-brand-300/30 group-hover:from-brand-300/25">
              <Building2 size={19} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <span className="mb-1 block text-[10px] font-medium tracking-wide text-brand-300/60">
                Active clinic
              </span>

              <SelectValue placeholder="Choose clinic" />
            </div>
          </div>
        </SelectTrigger>

        <SelectContent
          align="start"
          // position="popper"
          sideOffset={8}
          className="w-[var(--radix-select-trigger-width)] rounded-2xl border border-border/80 bg-popover/95 p-1.5 shadow-2xl backdrop-blur-2xl"
        >
          <div className="px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Your clinics
            </p>
          </div>

          {memberships.map((membership) => (
            <SelectItem
              key={membership.id}
              value={membership.clinic.name}
              className="mb-1 cursor-pointer rounded-xl py-3 pl-9 pr-3 focus:bg-accent"
            >
              <div className="flex w-full min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-800 dark:bg-brand-500/10 dark:text-brand-300">
                  <Building2 size={17} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-[13px] font-semibold text-popover-foreground">
                    {membership.clinic.name}
                  </span>

                  <span className="text-[11px] capitalize text-muted-foreground">
                    {membership.role}
                  </span>
                </div>

                {membership.clinic.name === activeClinic.name && (
                  <Check
                    size={16}
                    className="shrink-0 text-brand-700 dark:text-brand-300"
                  />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="mt-3 flex items-center gap-2 px-2 text-[10px] text-brand-300/40">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Switch between your clinics
      </p>
    </div>
  );
}
