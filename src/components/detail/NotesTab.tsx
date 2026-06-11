import type { Patient } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { ClinicalNotesView } from "@/components/clinical-notes/ClinicalNotesView";
import { NotesTabSkeleton } from "./NotesTabSkeleton";

export interface NotesTabProps {
  patient: Patient;
  recordId: number | null;
  expedientsLoading: boolean;
  expedientsError: string | null;
  onRetryExpedient: () => void;
  onNavigateToTab: (tabId: "records") => void;
  onNoteCreated?: () => void;
  className?: string;
}

function patientFullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name].filter(Boolean).join(" ");
}

export function NotesTab({
  patient,
  recordId,
  expedientsLoading,
  expedientsError,
  onRetryExpedient,
  onNavigateToTab,
  onNoteCreated,
  className,
}: NotesTabProps) {
  if (expedientsLoading && recordId == null) {
    return (
      <div className={className}>
        <NotesTabSkeleton label="Cargando expediente del paciente" />
      </div>
    );
  }

  if (expedientsError && recordId == null) {
    return (
      <div className={`flex flex-col gap-4 ${className ?? ""}`.trim()}>
        <p className="text-sm text-destructive">{expedientsError}</p>
        <Button type="button" variant="outline" size="sm" onClick={onRetryExpedient}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (recordId == null) {
    return (
      <div
        className={`rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center ${className ?? ""}`.trim()}
      >
        <p className="text-sm text-muted-foreground">
          {patientFullName(patient)} no tiene expediente clínico. Cree uno en la pestaña
          Expedientes para registrar notas clínicas.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Button type="button" size="sm" onClick={() => onNavigateToTab("records")}>
            Ir a Expedientes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ClinicalNotesView
      recordId={recordId}
      patientName={patientFullName(patient)}
      patientId={patient.id}
      onNoteCreated={onNoteCreated}
      className={className}
    />
  );
}
