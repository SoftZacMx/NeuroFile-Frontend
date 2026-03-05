import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/patient";

function fullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name]
    .filter(Boolean)
    .join(" ");
}

function initials(p: Patient): string {
  const first = p.first_name?.charAt(0) ?? "";
  const last = p.last_name?.charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
}

export interface PatientSelectListItemProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
}

export function PatientSelectListItem({
  patient,
  onSelect,
}: PatientSelectListItemProps) {
  return (
    <>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
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
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => onSelect(patient)}
        >
          Seleccionar
        </Button>
      </td>
    </>
  );
}
