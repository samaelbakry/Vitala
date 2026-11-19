import { supabase } from "@/lib/supabase";
import type { Clinic, ClinicMembership, UpdateClinicData } from "../types/clinic.type";

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

export async function updateClinic(clinicId:string , values:UpdateClinicData):Promise<Clinic>{

  const { data, error } = await supabase
  .from("clinics")
  .update({
    name:values.name.trim(),
    phone:values.phone,
    logo_url:values.logo_url,
    address:values.address,
    specialty:values.specialty
  })
  .eq("id", clinicId)
      .select(`
      id,
      name,
      specialty,
      phone,
      address,
      logo_url
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to update clinic");
  }

  return data as Clinic;
}