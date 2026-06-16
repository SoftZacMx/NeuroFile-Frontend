import type { ApiClient } from "@/lib/api-client";

export interface CreateConversationResponse {
  conversationId: number;
  startedAt: string;
  recordId?: number;
}

/**
 * Crea una sesión de grabación para un paciente (expediente nuevo) o para un expediente existente.
 * Con patientId: crea expediente vacío y la conversación. Con recordId: conversación para ese expediente.
 */
export async function createConversation(
  api: ApiClient,
  params: { patientId: number } | { recordId: number }
): Promise<CreateConversationResponse> {
  const body =
    "patientId" in params
      ? { patientId: params.patientId }
      : { recordId: params.recordId };
  const res = await api.post<CreateConversationResponse>("/conversations", body);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al iniciar la sesión de grabación");
  }
  return res.data;
}

/**
 * Termina una sesión de grabación. Marca la conversación como finalizada y encola el procesamiento.
 */
export async function endConversation(
  api: ApiClient,
  conversationId: number
): Promise<void> {
  const res = await api.post<unknown>(`/conversations/${conversationId}/end`, {});
  if (res.error) {
    throw new Error(res.message ?? "Error al terminar la grabación");
  }
}

export interface UploadFragmentParams {
  sequenceIndex: number;
  recordedAt: string;
  file: Blob;
}

/**
 * Sube un fragmento de audio a la conversación. Multipart: sequenceIndex, recordedAt, file.
 */
export async function uploadFragment(
  api: ApiClient,
  conversationId: number,
  params: UploadFragmentParams
): Promise<{ s3Key: string }> {
  const formData = new FormData();
  formData.append("sequenceIndex", String(params.sequenceIndex));
  formData.append("recordedAt", params.recordedAt);
  formData.append("file", params.file, "fragment.webm");

  const res = await api.postFormData<{ s3Key: string }>(
    `/conversations/${conversationId}/fragments/upload`,
    formData
  );
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al subir el fragmento");
  }
  return res.data;
}
