import { useActiveClinic } from "@/features/clinic/hooks/useActiveClinic";
import { useQuery } from "@tanstack/react-query";
import { getClinicStaff } from "../services/staff.services";

export function useClinicStaff() {
  const { activeClinicId } = useActiveClinic();

  return useQuery({
    queryKey: ["clinic-Staff", activeClinicId],
    queryFn: () => {
      if (!activeClinicId) {
        throw new Error("No active clinic selected");
      }
      return getClinicStaff(activeClinicId);
    },
    enabled:Boolean(activeClinicId)
    
  });
}
