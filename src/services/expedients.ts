import type { ApiClient } from "@/lib/api-client";
import type { CreateRecordPayload, Record } from "@/types/expedient";

export interface CreatedExpedient {
  id: number;
  patient_id: number;
  created_at: string;
  [key: string]: unknown;
}

export async function createExpedient(
  api: ApiClient,
  payload: CreateRecordPayload
): Promise<CreatedExpedient> {
  const res = await api.post<CreatedExpedient>("/expedients", payload);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al crear el expediente");
  }
  return res.data;
}

export async function getExpedients(api: ApiClient): Promise<Record[]> {
  const res = await api.get<Record[]>("/expedients");
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener expedientes");
  }
  return Array.isArray(res.data) ? res.data : [];
}

export async function getExpedient(
  api: ApiClient,
  expedientId: number
): Promise<Record> {
  const res = await api.get<Record>(`/expedients/${expedientId}`);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener el expediente");
  }
  return res.data;
}
