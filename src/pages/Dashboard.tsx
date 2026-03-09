import { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardStats, getDashboardAnalytics, type DashboardPeriod } from "@/services/dashboard";
import type { DashboardStats, DashboardAnalytics } from "@/types/dashboard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function IconPatients({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconCalendarToday({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  );
}

function IconCalendarNext({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M12 14v4M14 16l-2-2-2 2" />
    </svg>
  );
}

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: 7, label: "7 días" },
  { value: 30, label: "30 días" },
  { value: 90, label: "90 días" },
];

export default function Dashboard() {
  const { user, api } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [period, setPeriod] = useState<DashboardPeriod>(30);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats(api);
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar estadísticas");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const loadAnalytics = useCallback(
    async (p: DashboardPeriod) => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const data = await getDashboardAnalytics(api, p);
        setAnalytics(data);
      } catch (e) {
        setAnalyticsError(e instanceof Error ? e.message : "Error al cargar analíticas");
        setAnalytics(null);
      } finally {
        setAnalyticsLoading(false);
      }
    },
    [api]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadAnalytics(period);
  }, [period, loadAnalytics]);

  return (
    <div className="p-6">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      </header>
      <main className="mt-6 space-y-6">
        {user?.role === "admin" && (
          <p className="text-muted-foreground">
            Vista de administrador: acceso a usuarios y todos los pacientes.
          </p>
        )}
        {user?.role !== "admin" && (
          <p className="text-muted-foreground">
            Vista de terapeuta: acceso a sus pacientes.
          </p>
        )}

        {loading && (
          <p className="text-muted-foreground">Cargando estadísticas…</p>
        )}
        {error && (
          <p className="text-destructive">{error}</p>
        )}
        {!loading && !error && stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              label="Pacientes activos"
              value={stats.activePatients}
              icon={<IconPatients className="h-5 w-5" />}
            />
            <StatsCard
              label="Citas hoy"
              value={stats.appointmentsToday}
              icon={<IconCalendarToday className="h-5 w-5" />}
            />
            <StatsCard
              label="Citas para el próximo día"
              value={stats.appointmentsNextDay}
              icon={<IconCalendarNext className="h-5 w-5" />}
            />
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Analíticas por periodo</h2>
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPeriod(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {analyticsLoading && (
            <p className="text-muted-foreground">Cargando analíticas…</p>
          )}
          {analyticsError && (
            <p className="text-destructive">{analyticsError}</p>
          )}
          {!analyticsLoading && !analyticsError && analytics && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="rounded-lg shadow-sm">
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Citas por periodo
                  </h3>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={analytics.appointmentsByPeriod}
                      margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{ borderRadius: "6px" }}
                        formatter={(value: number) => [value, "Citas"]}
                        labelFormatter={(label) => `Periodo: ${label}`}
                      />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                        name="Citas"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="rounded-lg shadow-sm">
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Notas clínicas por periodo
                  </h3>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={analytics.clinicalNotesByPeriod}
                      margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{ borderRadius: "6px" }}
                        formatter={(value: number) => [value, "Notas"]}
                        labelFormatter={(label) => `Periodo: ${label}`}
                      />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--chart-2, var(--primary)))"
                        radius={[4, 4, 0, 0]}
                        name="Notas"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
