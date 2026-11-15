import { supabase } from "../../../lib/supabase";
import type { ClinicMembership } from "../types/role.type";

export async function signIn(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data;
}

export async function signUp(
  fullName: string,
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

  if (error) throw error;

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getMyMemberships(userId: string): Promise<ClinicMembership[]> {
  const { data, error } = await supabase
    .from("clinic_members")
    .select(`
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
    `)
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) throw error;

  return data as unknown as ClinicMembership[];
}