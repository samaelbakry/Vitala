import { useAppSelector } from "@/app/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateClinicData } from "../types/clinic.type";
import { updateClinic } from "../services/clinic.services";

export function useUpdateClinic() {
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.auth.user?.id);

  return useMutation({
    mutationFn: ({
      clinicId,
      values,
    }: {
      clinicId: string;
      values: UpdateClinicData;
    }) => updateClinic(clinicId, values),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["memberships", userId],
      });
    },
  });
}
