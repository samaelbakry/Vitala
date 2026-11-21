import { supabase } from "@/lib/supabase";
import type { ClinicStaffMember } from "../staff.type";

export async function getClinicStaff(
  clinicId: string,
): Promise<ClinicStaffMember[]> {
    const { data, error } = await supabase
    .from("clinic_members")
    .select(`
      id,
      clinic_id,
      user_id,
      role,
      status,
      created_at,
      profile:profiles (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to update clinic");
  }

  return (data ?? []) as unknown as ClinicStaffMember[];
}
