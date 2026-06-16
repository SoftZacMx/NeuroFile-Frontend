import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ActionTooltip } from "@/components/common/ActionTooltip";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/patient";

function formatLastAppointmentDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function IconEye({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconUserMinus({ className }: { className?: string }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" y1="11" x2="22" y2="11" />
    </svg>
  );
}

function IconUserCheck({ className }: { className?: string }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function fullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name].filter(Boolean).join(" ");
}

function initials(p: Patient): string {
  const first = p.first_name?.charAt(0) ?? "";
  const last = p.last_name?.charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
}

function stopRowClick(event: React.MouseEvent) {
  event.stopPropagation();
}

export interface PatientListItemProps {
  patient: Patient;
  onEdit?: (patient: Patient) => void;
  onToggleActiveStatus?: (patient: Patient) => void;
  togglingStatusId?: number | null;
}

export function PatientListItem({
  patient,
  onEdit,
  onToggleActiveStatus,
  togglingStatusId,
}: PatientListItemProps) {
  const isTogglingStatus = togglingStatusId === patient.id;
  const isActive = patient.is_active;

  return (
    <>
      <td className="px-4 py-3 text-muted-foreground">
        <span className="tabular-nums">{patient.id}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground"
            aria-hidden
          >
            {initials(patient)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{fullName(patient)}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <span className="tabular-nums">{patient.phone || "—"}</span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {patient.last_appointment
          ? formatLastAppointmentDate(patient.last_appointment.date)
          : "—"}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
            patient.is_active
              ? "bg-success text-success-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {patient.is_active ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1" onClick={stopRowClick}>
          <ActionTooltip label="Ver ficha del paciente">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              asChild
              aria-label="Ver ficha del paciente"
            >
              <Link to={`/patients/${patient.id}`}>
                <IconEye className="h-4 w-4" />
              </Link>
            </Button>
          </ActionTooltip>
          {onEdit && (
            <ActionTooltip label="Editar paciente">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Editar paciente"
                onClick={() => onEdit(patient)}
              >
                <IconPencil className="h-4 w-4" />
              </Button>
            </ActionTooltip>
          )}
          {onToggleActiveStatus && (
            <ActionTooltip
              label={isActive ? "Inactivar paciente" : "Reactivar paciente"}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isActive
                    ? "text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                    : "text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                )}
                aria-label={isActive ? "Inactivar paciente" : "Reactivar paciente"}
                disabled={isTogglingStatus}
                onClick={() => onToggleActiveStatus(patient)}
              >
                {isActive ? (
                  <IconUserMinus className="h-4 w-4" />
                ) : (
                  <IconUserCheck className="h-4 w-4" />
                )}
              </Button>
            </ActionTooltip>
          )}
        </div>
      </td>
    </>
  );
}
