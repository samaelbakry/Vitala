import { supabase } from "@/lib/supabase";
import type { ClinicMembership } from "../types/clinic.type";

export async function getMyMemberships(userId: string): Promise<ClinicMembership[]> {
  const { data, error } = await supabase
    .from("clinic_members")
    .select(
      `
      id,
      clinic_id,
      user_id,
      role,
      status,
      created_at,
      clinic:clinics (
        id,
        name
      )
    `,
    )
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as ClinicMembership[];
}

export async function createClinic(name: string): Promise<string> {
  const { data, error } = await supabase.rpc("create_clinic", {
    _name: name.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create clinic");
  }

  return data;
}