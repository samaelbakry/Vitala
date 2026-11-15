export type UserRole =
  | "admin"
  | "doctor"
  | "receptionist";

export type MembershipStatus =
  | "active"
  | "invited"
  | "suspended";

export type ClinicMembership = {
  id: string;
  clinic_id: string;
  user_id: string;
  role: UserRole;
  status: MembershipStatus;
  created_at: string;

  clinic: {
    id: string;
    name: string;
  };
}