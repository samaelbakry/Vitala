
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  Stethoscope,
  Building2,
  CheckCircle2,
} from "lucide-react";

import { useUpdateClinic } from "../hooks/useUpdateClinic";
import type { Clinic } from "../types/clinic.type";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const clinicSchema = z.object({
  name: z.string().trim().min(2, "Clinic name is required").max(100),
  specialty: z.string().trim(),
  phone: z.string().trim(),
  address: z.string().trim(),
});

type ClinicFormValues = z.infer<typeof clinicSchema>;

export default function ClinicProfileForm({
  clinic,
}: {
  clinic: Clinic;
}) {
  const updateClinicMutation = useUpdateClinic();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: clinic.name,
      specialty: clinic.specialty ?? "",
      phone: clinic.phone ?? "",
      address: clinic.address ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: clinic.name,
      specialty: clinic.specialty ?? "",
      phone: clinic.phone ?? "",
      address: clinic.address ?? "",
    });
  }, [clinic, reset]);

  const onSubmit = async (values: ClinicFormValues) => {
    try {
      await updateClinicMutation.mutateAsync({
        clinicId: clinic.id,
        values: {
          name: values.name,
          specialty: values.specialty || null,
          phone: values.phone || null,
          address: values.address || null,
          logo_url: clinic.logo_url,
        },
      });

      toast.success("Clinic information updated successfully");
    } catch {
      toast.error("Failed to update clinic information");
    }
  };

  const inputClassName =
    "h-11 rounded-xl border-border/70 bg-background/70 px-3.5 text-sm shadow-none transition-all placeholder:text-muted-foreground/60 hover:border-border focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-400/10";

  const iconClassName =
    "h-4 w-4 text-brand-700/70 dark:text-brand-300/80";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="flex items-start gap-3 border-b border-border/60 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-500/10 dark:text-brand-300">
          <Building2 size={20} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground">
            Clinic information
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your clinic details and contact information.
          </p>
        </div>
      </div>

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="clinic-name"
              className="text-sm font-semibold text-foreground"
            >
              Clinic name
            </label>

            <span className="rounded-md bg-brand-100/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-800 dark:bg-brand-900/10 dark:text-brand-300">
              Required
            </span>
          </div>

          <Input
            id="clinic-name"
            placeholder="Enter clinic name"
            aria-invalid={Boolean(errors.name)}
            className={`${inputClassName} ${
              errors.name
                ? "border-destructive focus-visible:ring-destructive/20"
                : ""
            }`}
            {...register("name")}
            disabled={updateClinicMutation.isPending}
          />

          {errors.name && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="specialty"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <Stethoscope className={iconClassName} />
            Specialty
          </label>

          <Input
            id="specialty"
            placeholder="e.g. General Medicine"
            className={inputClassName}
            {...register("specialty")}
            disabled={updateClinicMutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="clinic-phone"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <Phone className={iconClassName} />
            Phone number
          </label>

          <Input
            id="clinic-phone"
            placeholder="Enter phone number"
            className={inputClassName}
            {...register("phone")}
            disabled={updateClinicMutation.isPending}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="clinic-address"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <MapPin className={iconClassName} />
            Address
          </label>

          <Textarea
            id="clinic-address"
            placeholder="Enter your clinic's full address"
            className="min-h-28 resize-y rounded-xl border-border/70 bg-background/70 px-3.5 py-3 text-sm shadow-none transition-all placeholder:text-muted-foreground/60 hover:border-border focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-400/10"
            {...register("address")}
            disabled={updateClinicMutation.isPending}
            rows={3}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {isDirty ? (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <p className="text-xs font-medium text-muted-foreground">
                You have unsaved changes.
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-medium text-muted-foreground">
                All changes are saved.
              </p>
            </>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isDirty || updateClinicMutation.isPending}
          className="h-11 min-w-36 gap-2 rounded-xl bg-brand-800 px-5 font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md disabled:opacity-50 dark:bg-brand-300 dark:text-brand-950 dark:hover:bg-brand-200"
        >
          {updateClinicMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          <span>
            {updateClinicMutation.isPending
              ? "Saving..."
              : "Save changes"}
          </span>
        </Button>
      </div>
    </form>
  );
}
