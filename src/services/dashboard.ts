import type { ApiClient } from "@/lib/api-client";
import type { DashboardStats, DashboardAnalytics } from "@/types/dashboard";

export async function getDashboardStats(api: ApiClient): Promise<DashboardStats> {
  const res = await api.get<DashboardStats>("/dashboard/stats");
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener estadísticas del dashboard");
  }
  return res.data;
}

export type DashboardPeriod = 7 | 30 | 90;

export async function getDashboardAnalytics(
  api: ApiClient,
  period: DashboardPeriod
): Promise<DashboardAnalytics> {
  const res = await api.get<DashboardAnalytics>(`/dashboard/analytics?period=${period}`);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener analíticas");
  }
  return res.data;
}
