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

export type StaffInvitationRole = "doctor" | "receptionist";

export type InviteStaffPayload ={
  fullName: string;
  email: string;
  role: StaffInvitationRole;
  clinicId: string;
}

export type InviteStaffResponse ={
  success: boolean;
  message: string;
  invitationId: string;
}

export type InvitationStatusType =
  | "pending"
  | "accepted"
  | "expired"
  | "revoked";

export interface ClinicInvitation {
  id: string;
  email: string;
  role: StaffInvitationRole;
  status: InvitationStatusType;
  expires_at: string;
  created_at: string;
}