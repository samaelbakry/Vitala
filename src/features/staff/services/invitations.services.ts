import { supabase } from "@/lib/supabase";
import type { ClinicInvitation, InviteStaffPayload, InviteStaffResponse } from "../staff.type";

export async function inviteStaff(
  payload: InviteStaffPayload,
): Promise<InviteStaffResponse> {
  const { data, error } = await supabase.functions.invoke("invite-staff", {
    body: {
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      role: payload.role,
      clinicId: payload.clinicId,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to send invitation");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as InviteStaffResponse;
}

export async function acceptStaffInvitation(invitationId: string,token: string): Promise<string> {
  const { data, error } = await supabase.rpc("accept_clinic_invitation", {
    _invitation_id: invitationId,
    _token: token,
  });

  if (error) {
    throw new Error(error.message || "Failed to accept invitation.");
  }

  if (!data) {
    throw new Error("The invitation could not be accepted.");
  }

  return data as string;
}

export async function getClinicInvitations(clinicId: string): Promise<ClinicInvitation[]> {
  const { data, error } = await supabase.functions.invoke(
    "get-clinic-invitations",
    {
      body: { clinicId },
    },
  );

  if (error) {
    throw new Error(error.message || "Failed to load invitations");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return (data?.invitations ?? []) as ClinicInvitation[];
}