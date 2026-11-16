
import { useEffect } from "react";



import {
  setActiveClinic,
  clearActiveClinic,
} from "../clinicSlice";
import type { ClinicMembership } from "../types/clinic.type";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { useMyMemberships } from "@/features/auth/hooks/useMyMemberships";


const EMPTY_MEMBERSHIPS: ClinicMembership[] = [];

export function useActiveClinic() {
  const dispatch = useAppDispatch();

  const activeClinicId = useAppSelector((state) => state.clinic.activeClinicId);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useMyMemberships();

  const memberships = data ?? EMPTY_MEMBERSHIPS;

  const selectedMembership = memberships.find((membership) => membership.clinic_id === activeClinicId);

  // If no clinic was selected, use the first available clinic.
  const activeMembership = selectedMembership ?? memberships[0] ?? null;

  const activeClinic = activeMembership?.clinic ?? null;

  // Synchronize the default clinic with Redux.
  useEffect(() => {
    if (isPending) return;

    if (!activeMembership) {
      if (activeClinicId !== null) {
        dispatch(clearActiveClinic());
      }

      return;
    }

    if (activeClinicId !== activeMembership.clinic_id) {
      dispatch(setActiveClinic(activeMembership.clinic_id));
    }
  }, [
    isPending,
    activeClinicId,
    activeMembership,
    dispatch,
  ]);

  return {
    memberships,
    activeMembership,
    activeClinic,

    activeClinicId: activeMembership?.clinic_id ?? null,
    role: activeMembership?.role ?? null,

    isPending,
    isError,
    error,
    refetch,

    hasActiveClinic: Boolean(activeMembership),
  };
}
