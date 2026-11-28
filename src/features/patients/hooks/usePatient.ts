import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "../services/patients.services";

export function usePatient(clinicId: string, patientId: string) {
  return useQuery({
    queryKey: ["patient", clinicId, patientId],
    queryFn: () => getPatientById(clinicId!, patientId!),
    enabled: Boolean(clinicId && patientId),
  });
}
