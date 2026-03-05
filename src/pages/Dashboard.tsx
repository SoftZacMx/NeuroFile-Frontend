import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardStats } from "@/services/dashboard";
import type { DashboardStats } from "@/types/dashboard";
import { StatsCard } from "@/components/dashboard/StatsCard";

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

export default function Dashboard() {
  const { user, api } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadStats();
  }, [loadStats]);

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
      </main>
    </div>
  );
}
