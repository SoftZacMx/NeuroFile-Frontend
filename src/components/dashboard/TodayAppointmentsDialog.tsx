import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { DashboardTodayAppointment } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  appointmentStatusClassName,
  formatAppointmentTime,
  getAppointmentStatusLabel,
} from "./appointmentUtils";

export type DayAppointmentsScope = "today" | "tomorrow";

export interface DayAppointmentsDialogProps {
  day: DayAppointmentsScope;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointments: DashboardTodayAppointment[];
  error?: string | null;
  onRetry?: () => void;
}

const DAY_CONFIG: Record<
  DayAppointmentsScope,
  {
    title: string;
    emptyMessage: string;
    getDate: () => Date;
  }
> = {
  today: {
    title: "Citas de hoy",
    emptyMessage: "No tienes citas para hoy",
    getDate: () => new Date(),
  },
  tomorrow: {
    title: "Citas de mañana",
    emptyMessage: "No tienes citas para mañana",
    getDate: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    },
  },
};

function formatDayHeading(date: Date): string {
  const formatted = date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function IconCalendar({ className }: { className?: string }) {
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
    </svg>
  );
}

function IconChevronRight({ className }: { className?: string }) {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function DayAppointmentsDialog({
  day,
  open,
  onOpenChange,
  appointments,
  error = null,
  onRetry,
}: DayAppointmentsDialogProps) {
  const config = DAY_CONFIG[day];
  const navigate = useNavigate();
  const dayHeading = useMemo(() => formatDayHeading(config.getDate()), [day]);

  const handleAppointmentClick = (patientId: number) => {
    onOpenChange(false);
    navigate(`/patients/${patientId}`);
  };

  const handleScheduleClick = () => {
    onOpenChange(false);
    navigate("/patients");
  };

  const countLabel = appointments.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent className="max-w-lg bg-background p-0">
            <DialogHeader className="border-b border-border px-6 pb-4 pt-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconCalendar className="h-5 w-5" />
                </span>
                <div className="min-w-0 space-y-1">
                  <DialogTitle>{config.title}</DialogTitle>
                  <DialogDescription className="text-foreground/80">
                    {dayHeading}
                  </DialogDescription>
                  {!error && (
                    <p className="text-xs text-muted-foreground">
                      {countLabel === 1
                        ? "1 cita programada"
                        : `${countLabel} citas programadas`}
                    </p>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-4">
              {error && (
                <div className="space-y-3 py-4 text-center">
                  <p className="text-sm text-destructive">{error}</p>
                  {onRetry && (
                    <Button variant="outline" size="sm" onClick={onRetry}>
                      Reintentar
                    </Button>
                  )}
                </div>
              )}

              {!error && appointments.length === 0 && (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <IconCalendar className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {config.emptyMessage}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Elige un paciente para agendar una nueva cita.
                    </p>
                  </div>
                  <Button onClick={handleScheduleClick}>Agendar cita</Button>
                </div>
              )}

              {!error && appointments.length > 0 && (
                <ul className="space-y-2">
                  {appointments.map((appointment) => (
                    <li key={appointment.id}>
                      <button
                        type="button"
                        onClick={() => handleAppointmentClick(appointment.patientId)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors",
                          "hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        )}
                      >
                        <span className="w-14 shrink-0 text-sm font-semibold tabular-nums text-primary">
                          {formatAppointmentTime(appointment.date)}
                        </span>
                        <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                          {appointment.patientName}
                        </span>
                        <span className={appointmentStatusClassName(appointment)}>
                          {getAppointmentStatusLabel(appointment)}
                        </span>
                        <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!error && appointments.length > 0 && (
              <div className="border-t border-border px-6 py-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleScheduleClick}
                >
                  Agendar otra cita
                </Button>
              </div>
            )}
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}

export interface TodayAppointmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointments: DashboardTodayAppointment[];
  error?: string | null;
  onRetry?: () => void;
}

export function TodayAppointmentsDialog(props: TodayAppointmentsDialogProps) {
  return <DayAppointmentsDialog day="today" {...props} />;
}

export interface TomorrowAppointmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointments: DashboardTodayAppointment[];
  error?: string | null;
  onRetry?: () => void;
}

export function TomorrowAppointmentsDialog(props: TomorrowAppointmentsDialogProps) {
  return <DayAppointmentsDialog day="tomorrow" {...props} />;
}
