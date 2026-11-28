import { supabase } from "@/lib/supabase";
import type { CreatePatientPayload, Patient } from "../patients.type";

const patientSelect = `
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
`;

export type UpdatePatientPayload = {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: Patient["gender"];
  notes: string;
};

export async function getPatients(
  clinicId: string,
  search = "",
): Promise<Patient[]> {
  let query = supabase
    .from("patients")
    .select(patientSelect)
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

export async function getPatientById(
  clinicId: string,
  patientId: string,
): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .select(patientSelect)
    .eq("clinic_id", clinicId)
    .eq("id", patientId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Patient;
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

  const { data, error } = await supabase
    .from("patients")
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

  if (error) {
    throw new Error(error.message);
  }

  return data as Patient;
}

export async function updatePatient(
  clinicId: string,
  patientId: string,
  values: UpdatePatientPayload,
): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .update({
      full_name: values.fullName.trim(),
      phone: values.phone.trim() || null,
      email: values.email.trim().toLowerCase() || null,
      date_of_birth: values.dateOfBirth || null,
      gender: values.gender || null,
      notes: values.notes.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("clinic_id", clinicId)
    .eq("id", patientId)
    .select(patientSelect)
    .single();

  if (error) throw new Error(error.message);

  return data as Patient;
}