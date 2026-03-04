import type { Patient } from "@/types/patient";
import type { ApiClient } from "@/lib/api-client";

export async function getPatients(api: ApiClient): Promise<Patient[]> {
  const res = await api.get<Patient[]>("/patients");
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener pacientes");
  }
  return Array.isArray(res.data) ? res.data : [];
}

export async function getPatient(
  api: ApiClient,
  patientId: string | number
): Promise<Patient> {
  const res = await api.get<Patient>(`/patients/${patientId}`);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener el paciente");
  }
  return res.data;
}

export type PatientUpdatePayload = Pick<
  Patient,
  | "first_name"
  | "last_name"
  | "second_last_name"
  | "age"
  | "gender"
  | "address"
  | "is_active"
  | "occupation"
  | "phone"
>;

export async function updatePatient(
  api: ApiClient,
  patientId: string | number,
  payload: PatientUpdatePayload
): Promise<Patient> {
  const res = await api.put<Patient>(`/patients/${patientId}`, payload);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al actualizar el paciente");
  }
  return res.data;
}

export type CreatePatientPayload = PatientUpdatePayload & { user_id: number };

export async function createPatient(
  api: ApiClient,
  payload: CreatePatientPayload
): Promise<Patient> {
  const res = await api.post<Patient>("/patients", payload);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al crear el paciente");
  }
  return res.data;
}

export async function deletePatient(
  api: ApiClient,
  patientId: string | number
): Promise<void> {
  const res = await api.delete<Patient>(`/patients/${patientId}`);
  if (res.error) {
    throw new Error(res.message ?? "Error al eliminar el paciente");
  }
}
