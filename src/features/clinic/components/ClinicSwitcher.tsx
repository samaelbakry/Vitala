
import { Building2 } from "lucide-react";

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
      <div className="mx-3 my-4 h-14 animate-pulse rounded-2xl border border-white/6 bg-white/4" />
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
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-300/20 bg-brand-300/10 text-brand-300 shadow-inner transition-colors hover:bg-brand-300/20"
        >
          <Building2 size={19} strokeWidth={1.6} />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-5">
      <p className="mb-2.5 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-300/60">
        Workspace
      </p>

      <Select
        value={activeClinic.name}
        onValueChange={handleClinicChange}
      >
        <SelectTrigger className="group h-auto min-h-15.5 w-full rounded-2xl border border-white/9 bg-white/4.5 px-3 py-2.5 text-brand-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all hover:border-brand-300/30 hover:bg-white/7.5 focus:ring-1 focus:ring-brand-300/30 [&>svg]:text-brand-300/70">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-300/20 bg-brand-300/10 text-brand-300 transition-colors group-hover:bg-brand-300/15">
              <Building2 size={18} strokeWidth={1.6} />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <span className="mb-1 block text-[10px] font-normal tracking-wide text-brand-300/60">
                Active clinic
              </span>

              <SelectValue placeholder="Choose clinic" />
            </div>
          </div>
        </SelectTrigger>

        <SelectContent
          align="start"
          className="w-(--radix-select-trigger-width) rounded-xl border border-border/80 bg-popover/95 p-1.5 shadow-xl backdrop-blur-2xl"
        >
          {memberships.map((membership) => (
            <SelectItem
              key={membership.id}
              value={membership.clinic_id}
              className="cursor-pointer rounded-lg py-3 pl-9 pr-3 focus:bg-accent"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-popover-foreground">
                  {membership.clinic.name}
                </span>

                <span className="text-[11px] capitalize text-muted-foreground">
                  {membership.role}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="mt-2.5 px-2 text-[10px] text-brand-300/40">
        Switch between your clinics
      </p>
    </div>
  );
}
