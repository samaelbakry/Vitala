import type { MembershipStatus, UserRole } from "@/features/auth/types/role.type";

export type Clinic = {
  id: string;
  name: string;
};

export type ClinicMembership = {
  id: string;
  clinic_id: string;
  user_id: string;
  role: UserRole;
  status: MembershipStatus;
  created_at: string;
  clinic: Clinic;
};
