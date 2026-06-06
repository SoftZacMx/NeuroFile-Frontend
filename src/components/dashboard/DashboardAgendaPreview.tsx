import type { DashboardTodayAppointment } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  appointmentStatusClassName,
  formatAppointmentTime,
  getAppointmentStatusLabel,
} from "./appointmentUtils";

const PREVIEW_LIMIT = 5;

export interface DashboardAgendaPreviewProps {
  title: string;
  subtitle?: string;
  appointments: DashboardTodayAppointment[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRetry?: () => void;
  onViewAll?: () => void;
  onAppointmentClick: (patientId: number) => void;
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

export function DashboardAgendaPreview({
  title,
  subtitle,
  appointments,
  loading,
  error,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
  onRetry,
  onViewAll,
  onAppointmentClick,
}: DashboardAgendaPreviewProps) {
  const preview = appointments.slice(0, PREVIEW_LIMIT);
  const hasMore = appointments.length > PREVIEW_LIMIT;

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {(subtitle || (!loading && !error && hasMore && onViewAll)) && (
          <div className="flex shrink-0 flex-col items-end gap-1">
            {subtitle && (
              <p className="text-right text-xs text-muted-foreground">{subtitle}</p>
            )}
            {!loading && !error && hasMore && onViewAll && (
              <Button variant="ghost" size="sm" className="h-auto px-2 py-1" onClick={onViewAll}>
                Ver todas
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {loading && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Cargando citas…
          </p>
        )}

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

        {!loading && !error && appointments.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            {emptyActionLabel && onEmptyAction && (
              <Button variant="outline" size="sm" onClick={onEmptyAction}>
                {emptyActionLabel}
              </Button>
            )}
          </div>
        )}

        {!loading && !error && preview.length > 0 && (
          <ul className="space-y-2">
            {preview.map((appointment) => (
              <li key={appointment.id}>
                <button
                  type="button"
                  onClick={() => onAppointmentClick(appointment.patientId)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors",
                    "hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  )}
                >
                  <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-primary">
                    {formatAppointmentTime(appointment.date)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
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
      </CardContent>
    </Card>
  );
}
