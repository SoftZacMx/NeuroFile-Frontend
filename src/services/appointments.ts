import type { ApiClient } from "@/lib/api-client";
import type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "@/types/appointment";

export interface GetAppointmentsOptions {
  patientId?: number;
}

export async function getAppointments(
  api: ApiClient,
  options?: GetAppointmentsOptions
): Promise<Appointment[]> {
  const query =
    options?.patientId != null
      ? `?patientId=${options.patientId}`
      : "";
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
