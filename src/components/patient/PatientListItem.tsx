import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/patient";

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

function fullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name].filter(Boolean).join(" ");
}

function initials(p: Patient): string {
  const first = p.first_name?.charAt(0) ?? "";
  const last = p.last_name?.charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
}

export interface PatientListItemProps {
  patient: Patient;
  onDelete?: (patient: Patient) => void;
  deletingId?: number | null;
}

export function PatientListItem({
  patient,
  onDelete,
  deletingId,
}: PatientListItemProps) {
  const isDeleting = deletingId === patient.id;

  return (
    <>
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
            <p className="truncate text-xs text-muted-foreground">
              {patient.phone || patient.occupation || "—"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{patient.id}</td>
      <td className="px-4 py-3 text-muted-foreground">—</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
            patient.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          {patient.is_active ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            asChild
            aria-label="Ver"
          >
            <Link to={`/patients/${patient.id}`}>
              <IconEye className="h-4 w-4" />
            </Link>
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              aria-label="Eliminar"
              disabled={isDeleting}
              onClick={() => onDelete(patient)}
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </>
  );
}
