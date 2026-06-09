import type { Patient } from "@/types/patient";
import type { PatientUpdatePayload } from "@/services/patients";

export const PATIENT_GENDER_OPTIONS = [
  { value: "", label: "Seleccione género" },
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "Otro", label: "Otro" },
] as const;

const GENDER_ALIASES: Record<string, (typeof PATIENT_GENDER_OPTIONS)[number]["value"]> = {
  M: "M",
  F: "F",
  Otro: "Otro",
  Masculino: "M",
  Femenino: "F",
  masculino: "M",
  femenino: "F",
  m: "M",
  f: "F",
};

/** Maps legacy or free-text gender values to canonical form values (M, F, Otro). */
export function normalizePatientGender(gender: string | null | undefined): string {
  if (!gender?.trim()) return "";
  const normalized = GENDER_ALIASES[gender.trim()];
  return normalized ?? "";
}

export function patientToUpdatePayload(
  patient: Patient,
  overrides?: Partial<PatientUpdatePayload>
): PatientUpdatePayload {
  return {
    first_name: patient.first_name,
    last_name: patient.last_name,
    second_last_name: patient.second_last_name ?? null,
    age: patient.age,
    gender: normalizePatientGender(patient.gender) || patient.gender,
    address: patient.address ?? null,
    is_active: patient.is_active,
    occupation: patient.occupation,
    phone: patient.phone,
    ...overrides,
  };
}
