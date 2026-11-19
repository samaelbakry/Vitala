import type { MembershipStatus, UserRole } from "@/features/auth/types/role.type";

export interface Clinic {
  id: string;
  name: string;
  specialty: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
}

export type ClinicMembership = {
  id: string;
  clinic_id: string;
  user_id: string;
  role: UserRole;
  status: MembershipStatus;
  created_at: string;
  clinic: Clinic;
};

export type UpdateClinicData ={
  name: string;
  specialty: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
}