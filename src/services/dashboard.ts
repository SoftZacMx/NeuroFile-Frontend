import type { ApiClient } from "@/lib/api-client";
import type { DashboardStats, DashboardTodayAppointment } from "@/types/dashboard";

export async function getDashboardStats(api: ApiClient): Promise<DashboardStats> {
  const res = await api.get<DashboardStats>("/dashboard/stats");
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener estadísticas del dashboard");
  }
  return res.data;
}

export async function getDashboardTodayAppointments(
  api: ApiClient
): Promise<DashboardTodayAppointment[]> {
  const res = await api.get<DashboardTodayAppointment[]>("/dashboard/appointments/today");
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener las citas de hoy");
  }
  return Array.isArray(res.data) ? res.data : [];
}

export async function getDashboardTomorrowAppointments(
  api: ApiClient
): Promise<DashboardTodayAppointment[]> {
  const res = await api.get<DashboardTodayAppointment[]>("/dashboard/appointments/tomorrow");
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener las citas de mañana");
  }
  return Array.isArray(res.data) ? res.data : [];
}
