import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointment";

export interface AppointmentDetailProps {
  appointment: Appointment | null;
  patientName: string;
  patientIdDisplay?: string;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onStartConsultation?: (appointment: Appointment) => void;
}

function formatTimeRange(dateStr: string, durationMinutes = 60): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const start = d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(d.getTime() + durationMinutes * 60 * 1000);
  const endStr = end.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${start} - ${endStr}`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

export function AppointmentDetail({
  appointment,
  patientName,
  patientIdDisplay,
  onEdit,
  onDelete,
  onStartConsultation,
}: AppointmentDetailProps) {
  if (!appointment) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Seleccione una cita del calendario para ver el detalle.
        </p>
      </div>
    );
  }

  const statusLabel = appointment.status ? "Pendiente" : "Cancelada";
  const attendedLabel =
    appointment.attended === true
      ? "Atendida"
      : appointment.attended === false
        ? "No atendida"
        : null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Detalle de la cita
      </h3>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {initials(patientName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{patientName}</p>
            {patientIdDisplay && (
              <p className="text-xs text-muted-foreground">
                ID: {patientIdDisplay}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Estado:</span>
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                appointment.status
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {statusLabel}
            </span>
            {attendedLabel && (
              <span className="text-muted-foreground">· {attendedLabel}</span>
            )}
          </div>
          <p className="text-muted-foreground">
            Hora: {formatTimeRange(appointment.date)}
          </p>
          <p className="text-muted-foreground">Servicio: Consulta</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {onStartConsultation && appointment.status && (
            <Button
              size="sm"
              onClick={() => onStartConsultation(appointment)}
            >
              Iniciar consulta
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(appointment)}
              aria-label="Editar"
            >
              <IconPencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(appointment)}
              aria-label="Eliminar"
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function IconPencil({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18v2H3zM8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
    </svg>
  );
}
