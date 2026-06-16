import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDashboardStats,
  getDashboardTodayAppointments,
  getDashboardTomorrowAppointments,
} from "@/services/dashboard";
import type { DashboardStats, DashboardTodayAppointment } from "@/types/dashboard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { DashboardAgendaPreview } from "@/components/dashboard/DashboardAgendaPreview";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { formatAgendaDateSubtitle } from "@/components/dashboard/appointmentUtils";
import {
  TodayAppointmentsDialog,
  TomorrowAppointmentsDialog,
} from "@/components/dashboard/TodayAppointmentsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<DashboardTodayAppointment[]>([]);
  const [tomorrowAppointments, setTomorrowAppointments] = useState<DashboardTodayAppointment[]>([]);
  const [agendaLoading, setAgendaLoading] = useState(true);
  const [agendaError, setAgendaError] = useState<string | null>(null);
  const [todayAppointmentsOpen, setTodayAppointmentsOpen] = useState(false);
  const [tomorrowAppointmentsOpen, setTomorrowAppointmentsOpen] = useState(false);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setInitialLoading(true);
      setAgendaLoading(true);
    }
    setError(null);
    setAgendaError(null);
    try {
      const [statsData, todayData, tomorrowData] = await Promise.all([
        getDashboardStats(api),
        getDashboardTodayAppointments(api),
        getDashboardTomorrowAppointments(api),
      ]);
      setStats(statsData);
      setTodayAppointments(todayData);
      setTomorrowAppointments(tomorrowData);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error al cargar el dashboard";
      setError(message);
      setAgendaError(message);
      if (!isRefresh) {
        setStats(null);
        setTodayAppointments([]);
        setTomorrowAppointments([]);
      }
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
      setAgendaLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadDashboard(false);
  }, [loadDashboard]);

  const handlePatientClick = (patientId: number) => {
    navigate(`/patients/${patientId}`);
  };

  const isEmptyWorkspace =
    stats != null &&
    stats.activePatients === 0 &&
    stats.appointmentsToday === 0 &&
    stats.appointmentsNextDay === 0;

  return (
    <div className="p-6">
      <DashboardHeader
        user={user}
        onRefresh={() => loadDashboard(true)}
        refreshing={refreshing}
      />

      <main className="mt-6 space-y-6">
        {initialLoading && <DashboardSkeleton />}
        {error && !initialLoading && (
          <div className="space-y-2">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => loadDashboard(false)}>
              Reintentar
            </Button>
          </div>
        )}

        {!initialLoading && !error && stats && (
          <>
            {!isEmptyWorkspace && <DashboardQuickActions />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                label="Pacientes activos"
                value={stats.activePatients}
                icon={<IconPatients className="h-5 w-5" />}
                to="/patients?status=active"
                ariaLabel={`Ver ${stats.activePatients} pacientes activos`}
              />
              <StatsCard
                label="Citas hoy"
                value={stats.appointmentsToday}
                icon={<IconCalendarToday className="h-5 w-5" />}
                onClick={() => setTodayAppointmentsOpen(true)}
                ariaLabel={`Ver ${stats.appointmentsToday} citas de hoy`}
              />
              <StatsCard
                label="Citas de mañana"
                value={stats.appointmentsNextDay}
                icon={<IconCalendarNext className="h-5 w-5" />}
                onClick={() => setTomorrowAppointmentsOpen(true)}
                ariaLabel={`Ver ${stats.appointmentsNextDay} citas de mañana`}
              />
            </div>

            {isEmptyWorkspace && (
              <Card className="rounded-lg border-dashed shadow-sm">
                <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                  <p className="text-lg font-medium text-foreground">
                    Bienvenido a NeuroFile
                  </p>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Aún no tienes pacientes ni citas registradas. Comienza creando
                    tu primer paciente para agendar consultas y gestionar expedientes.
                  </p>
                  <Button onClick={() => navigate("/patients?create=1")}>
                    Crear primer paciente
                  </Button>
                </CardContent>
              </Card>
            )}

            {!isEmptyWorkspace && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <DashboardAgendaPreview
                  title="Tu agenda de hoy"
                  subtitle={formatAgendaDateSubtitle(0)}
                  appointments={todayAppointments}
                  loading={agendaLoading}
                  error={agendaError}
                  emptyMessage="No tienes citas programadas para hoy."
                  emptyActionLabel="Agendar cita"
                  onEmptyAction={() => navigate("/patients")}
                  onRetry={() => loadDashboard(true)}
                  onViewAll={() => setTodayAppointmentsOpen(true)}
                  onAppointmentClick={handlePatientClick}
                />
                <DashboardAgendaPreview
                  title="Citas de mañana"
                  subtitle={formatAgendaDateSubtitle(1)}
                  appointments={tomorrowAppointments}
                  loading={agendaLoading}
                  error={agendaError}
                  emptyMessage="No tienes citas programadas para mañana."
                  emptyActionLabel="Agendar cita"
                  onEmptyAction={() => navigate("/patients")}
                  onRetry={() => loadDashboard(true)}
                  onViewAll={() => setTomorrowAppointmentsOpen(true)}
                  onAppointmentClick={handlePatientClick}
                />
              </div>
            )}
          </>
        )}
      </main>

      <TodayAppointmentsDialog
        open={todayAppointmentsOpen}
        onOpenChange={setTodayAppointmentsOpen}
        appointments={todayAppointments}
        error={agendaError}
        onRetry={() => loadDashboard(true)}
      />
      <TomorrowAppointmentsDialog
        open={tomorrowAppointmentsOpen}
        onOpenChange={setTomorrowAppointmentsOpen}
        appointments={tomorrowAppointments}
        error={agendaError}
        onRetry={() => loadDashboard(true)}
      />
    </div>
  );
}
