import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePatient,
  type UpdatePatientPayload,
} from "../services/patients.services";

type UpdatePatientVariables = {
  clinicId: string;
  patientId: string;
  values: UpdatePatientPayload;
};

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clinicId,
      patientId,
      values,
    }: UpdatePatientVariables) => updatePatient(clinicId, patientId, values),

    onSuccess: async (patient, variables) => {
      queryClient.setQueryData(
        ["patient", variables.clinicId, variables.patientId],
        patient,
      );

      await queryClient.invalidateQueries({
        queryKey: ["patients", variables.clinicId],
      });
    },
  });
}