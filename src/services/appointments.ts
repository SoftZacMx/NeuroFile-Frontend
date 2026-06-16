import type { ApiClient } from "@/lib/api-client";
import type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "@/types/appointment";

export interface GetAppointmentsOptions {
  patientId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export async function getAppointments(
  api: ApiClient,
  options?: GetAppointmentsOptions
): Promise<Appointment[]> {
  const params = new URLSearchParams();
  if (options?.patientId != null) params.set("patientId", String(options.patientId));
  if (options?.dateFrom) params.set("dateFrom", options.dateFrom);
  if (options?.dateTo) params.set("dateTo", options.dateTo);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get<Appointment[]>(`/appointments${query}`);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener las citas");
  }
  return Array.isArray(res.data) ? res.data : [];
}

export async function getAppointment(
  api: ApiClient,
  appointmentId: number
): Promise<Appointment> {
  const res = await api.get<Appointment>(`/appointments/${appointmentId}`);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener la cita");
  }
  return res.data;
}

export async function createAppointment(
  api: ApiClient,
  payload: CreateAppointmentPayload
): Promise<Appointment> {
  const res = await api.post<Appointment>("/appointments", payload);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al crear la cita");
  }
  return res.data;
}

export async function updateAppointment(
  api: ApiClient,
  appointmentId: number,
  payload: UpdateAppointmentPayload
): Promise<Appointment> {
  const res = await api.put<Appointment>(
    `/appointments/${appointmentId}`,
    payload
  );
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al actualizar la cita");
  }
  return res.data;
}

export async function deleteAppointment(
  api: ApiClient,
  appointmentId: number
): Promise<void> {
  const res = await api.delete<Appointment>(`/appointments/${appointmentId}`);
  if (res.error) {
    throw new Error(res.message ?? "Error al eliminar la cita");
  }
}
