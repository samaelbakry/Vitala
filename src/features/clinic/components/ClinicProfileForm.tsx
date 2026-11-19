
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AlertCircle, Loader2, MapPin, Phone, Stethoscope } from "lucide-react";

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


export default function ClinicProfileForm({clinic}: {clinic:Clinic}) {
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

  console.log(isDirty)

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

  return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
  <div className="grid gap-6 sm:grid-cols-2">
    <div className="space-y-2 sm:col-span-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="clinic-name"
          className="text-sm font-medium text-foreground"
        >
          Clinic name
        </label>
        <span className="text-xs text-muted-foreground">Required</span>
      </div>

      <Input
        id="clinic-name"
        placeholder="Enter clinic name"
        aria-invalid={Boolean(errors.name)}
        className={
          errors.name
            ? "border-destructive focus-visible:ring-destructive/30"
            : "transition-colors"
        }
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
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Specialty</span>
      </label>

      <Input
        id="specialty"
        placeholder="e.g. General Medicine"
        className="transition-colors"
        {...register("specialty")}
        disabled={updateClinicMutation.isPending}
      />
    </div>

    <div className="space-y-2">
      <label
        htmlFor="clinic-phone"
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Phone number</span>
      </label>

      <Input
        id="clinic-phone"
        placeholder="Enter phone number"
        className="transition-colors"
        {...register("phone")}
        disabled={updateClinicMutation.isPending}
      />
    </div>

    <div className="space-y-2 sm:col-span-2">
      <label
        htmlFor="clinic-address"
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Address</span>
      </label>

      <Textarea
        id="clinic-address"
        placeholder="Enter clinic address"
        className="resize-y transition-colors"
        {...register("address")}
        disabled={updateClinicMutation.isPending}
        rows={3}
      />
    </div>
  </div>

  <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-xs text-muted-foreground">
      {isDirty ? "You have unsaved changes." : "All changes are saved."}
    </p>

    <Button
      type="submit"
      disabled={!isDirty || updateClinicMutation.isPending}
      className="min-w-32 gap-2"
    >
      {updateClinicMutation.isPending && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      <span>
        {updateClinicMutation.isPending ? "Saving..." : "Save changes"}
      </span>
    </Button>
  </div>
</form>
  );
}
