import type { ApiClient } from "@/lib/api-client";
import type {
  ClinicalNote,
  CreateClinicalNotePayload,
  UpdateClinicalNotePayload,
} from "@/types/clinical-note";

export interface GetClinicalNotesOptions {
  dateFrom?: string;
  dateTo?: string;
}

export async function getClinicalNotes(
  api: ApiClient,
  recordId: number,
  options?: GetClinicalNotesOptions
): Promise<ClinicalNote[]> {
  const params = new URLSearchParams();
  params.set("record_id", String(recordId));
  if (options?.dateFrom) params.set("dateFrom", options.dateFrom);
  if (options?.dateTo) params.set("dateTo", options.dateTo);
  const res = await api.get<ClinicalNote[]>(
    `/clinical-notes?${params.toString()}`
  );
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener las notas clínicas");
  }
  return Array.isArray(res.data) ? res.data : [];
}

export async function getClinicalNote(
  api: ApiClient,
  noteId: number
): Promise<ClinicalNote> {
  const res = await api.get<ClinicalNote>(`/clinical-notes/${noteId}`);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener la nota");
  }
  return res.data;
}

export async function createClinicalNote(
  api: ApiClient,
  payload: CreateClinicalNotePayload
): Promise<ClinicalNote> {
  const res = await api.post<ClinicalNote>("/clinical-notes", payload);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al crear la nota");
  }
  return res.data;
}

export async function updateClinicalNote(
  api: ApiClient,
  noteId: number,
  payload: UpdateClinicalNotePayload
): Promise<ClinicalNote> {
  const res = await api.put<ClinicalNote>(
    `/clinical-notes/${noteId}`,
    payload
  );
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al actualizar la nota");
  }
  return res.data;
}

export async function deleteClinicalNote(
  api: ApiClient,
  noteId: number
): Promise<void> {
  const res = await api.delete<ClinicalNote>(`/clinical-notes/${noteId}`);
  if (res.error) {
    throw new Error(res.message ?? "Error al eliminar la nota");
  }
}
