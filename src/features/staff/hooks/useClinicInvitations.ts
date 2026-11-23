import { useQuery } from "@tanstack/react-query";
import { getClinicInvitations } from "../services/invitations.services";

export function useClinicInvitations(clinicId: string | undefined) {
  return useQuery({
    queryKey: ["clinic-invitations", clinicId],
    queryFn: () => getClinicInvitations(clinicId!),
    enabled: Boolean(clinicId),
  });
}
