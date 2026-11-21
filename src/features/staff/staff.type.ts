import type { MembershipStatus, UserRole } from "../auth/types/role.type";

export type ClinicStaffMember = {
  id: string;
  clinic_id: string;
  user_id: string;
  role: UserRole;
  status: MembershipStatus;
  created_at: string;
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}