import type { ApiClient } from "@/lib/api-client";
import type { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(api: ApiClient): Promise<DashboardStats> {
  const res = await api.get<DashboardStats>("/dashboard/stats");
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener estadísticas del dashboard");
  }
  return res.data;
}
