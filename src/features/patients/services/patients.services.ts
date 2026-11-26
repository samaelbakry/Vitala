import { supabase } from "@/lib/supabase";
import type { CreatePatientPayload, Patient } from "../patients.type";

export async function getPatients(
  clinicId: string,
  search = "",
): Promise<Patient[]> {
  let query = supabase
    .from("patients")
    .select(
      `
      id,
      clinic_id,
      full_name,
      phone,
      email,
      date_of_birth,
      gender,
      notes,
      created_by,
      created_at,
      updated_at
    `,
    )
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false });

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    query = query.ilike("full_name", `%${trimmedSearch}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Patient[];
}

export async function createPatient(
  payload: CreatePatientPayload,
): Promise<Patient> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to add a patient.");
  }

  const { data , error } = await supabase.from("patients")
   .insert({
      clinic_id: payload.clinicId,
      full_name: payload.fullName.trim(),
      phone: payload.phone?.trim() || null,
      email: payload.email?.trim().toLowerCase() || null,
      date_of_birth: payload.dateOfBirth || null,
      gender: payload.gender || null,
      notes: payload.notes?.trim() || null,
      created_by: user.id,
    })
    .select()
    .single();

    if(error) {
      throw new Error(error.message)
    }

    return data as Patient
}
