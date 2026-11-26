import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../services/patients.services";

export function usePatients(clinicId: string, search: string) {
  const normalizedSearch = search.trim();

  return useQuery({
    queryKey: ["patients", clinicId, normalizedSearch],
    queryFn: () => getPatients(clinicId!, normalizedSearch),
    enabled: Boolean(clinicId),
  });
}
