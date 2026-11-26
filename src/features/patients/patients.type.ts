export type PatientGender = "female" | "male" ;

export type Patient = {
  id: string;
  clinic_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: PatientGender | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePatientPayload = {
  clinicId: string;
  fullName: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: Patient["gender"];
  notes?: string;
};