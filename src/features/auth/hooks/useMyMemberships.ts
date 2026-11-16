import { useAppSelector } from "@/app/store";
import { getMyMemberships } from "@/features/clinic/services/clinic.services";
import { useQuery } from "@tanstack/react-query";

export function useMyMemberships() {
  const userId = useAppSelector((state) => state.auth.user?.id);

  return useQuery({
    queryKey: ["memberships", userId],

    queryFn: () => {
      if (!userId) {
        throw new Error("User is not authenticated");
      }

      return getMyMemberships(userId);
    },

    enabled:Boolean(userId),

    staleTime: 1000 * 60 * 5,
  });
}