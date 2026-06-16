import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointment";

export interface AppointmentListProps {
  appointments: Appointment[];
  selectedAppointmentId: number | null;
  onSelectAppointment: (appointment: Appointment) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AppointmentList({
  appointments,
  selectedAppointmentId,
  onSelectAppointment,
}: AppointmentListProps) {
  const sorted = [...appointments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Lista de citas
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No hay citas programadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Lista de citas ({sorted.length})
      </h3>
      <ul className="space-y-1">
        {sorted.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => onSelectAppointment(a)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                selectedAppointmentId === a.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-muted/50"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground">
                  {formatDate(a.date)}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    a.status
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {a.status ? "Pendiente" : "Cancelada"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatTime(a.date)}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
