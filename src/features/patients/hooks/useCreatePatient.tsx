import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePatientPayload } from "../patients.type";
import { createPatient } from "../services/patients.services";

export function useCreatePatient() {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onSuccess: async (_, Variables) => {
      await queryclient.invalidateQueries({
        queryKey: ["patients", Variables.clinicId],
      });
    },
  });
}
