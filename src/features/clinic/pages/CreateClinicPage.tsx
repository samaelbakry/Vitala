import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import {
  createClinic,
  getMyMemberships,
} from "@/features/clinic/services/clinic.services";
import { setActiveClinic } from "@/features/clinic/clinicSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const clinicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Clinic name must be at least 2 characters")
    .max(100, "Clinic name cannot exceed 100 characters"),
});

type ClinicFormValues = z.infer<typeof clinicSchema>;

export default function CreateClinicPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.auth.user?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
    },
  });

  const createClinicMutation = useMutation({
    mutationFn: createClinic,

    onSuccess: async (clinicId) => {
      dispatch(setActiveClinic(clinicId));
      if (!userId) {
        toast.error("Unable to identify the current user.");
        return;
      }
      try {
        await queryClient.fetchQuery({
          queryKey: ["memberships", userId],
          queryFn: () => getMyMemberships(userId!),
        });

        toast.success("Your clinic has been created successfully");

        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Failed to refresh memberships:", error);

        toast.error("Clinic created, but failed to load your membership.");
      }
    },
  });

  const onSubmit = async (values: ClinicFormValues) => {
    createClinicMutation.mutate(values.name);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-brand-700/10 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-300/30 bg-brand-100 text-brand-800 shadow-sm dark:bg-brand-700/30 dark:text-brand-100">
            <Building2 size={28} strokeWidth={1.6} />
          </div>

          <p className="mb-2 text-sm font-medium tracking-wide text-brand-700 dark:text-brand-300">
            WELCOME TO VITALA
          </p>

          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Create your clinic
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Set up your clinic workspace and start managing your team and
            patients.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-xl shadow-brand-950/5 backdrop-blur-2xl sm:p-8"
        >
          <div className="mb-6">
            <label
              htmlFor="clinic-name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Clinic name
            </label>

            <Input
              id="clinic-name"
              placeholder="e.g. Vitala Medical Center"
              disabled={createClinicMutation.isPending}
              {...register("name")}
              className="h-12 rounded-xl bg-background/70"
            />

            {errors.name && (
              <p className="mt-2 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="mb-6 rounded-xl border border-brand-300/20 bg-brand-100/40 p-4 dark:bg-brand-700/15">
            <p className="text-sm font-medium text-brand-900 dark:text-brand-100">
              You'll become the clinic administrator
            </p>

            <p className="mt-1 text-xs leading-5 text-brand-800/75 dark:text-brand-100/70">
              You will be able to manage clinic settings, invite staff members,
              and control their access.
            </p>
          </div>

          <Button
            type="submit"
            disabled={createClinicMutation.isPending}
            className="h-12 w-full rounded-xl bg-brand-800 text-white hover:bg-brand-700 dark:bg-brand-300 dark:text-brand-950 dark:hover:bg-brand-100"
          >
            {createClinicMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating clinic...
              </>
            ) : (
              <>
                Create clinic
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          You can update your clinic information later.
        </p>
      </div>
    </main>
  );
}
