import { Link } from "react-router-dom";
import type { Patient } from "@/types/patient";
import type { Record } from "@/types/expedient";
import { Button } from "@/components/ui/button";
import { RecordResume } from "@/components/record-resume/RecordResume";
import { RecordsTabSkeleton } from "./RecordsTabSkeleton";

export interface RecordsTabProps {
  patient: Patient;
  records: Record[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onRetry: () => void;
  className?: string;
}

function patientFullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name].filter(Boolean).join(" ");
}

export function RecordsTab({
  patient,
  records,
  loading,
  refreshing,
  error,
  onRefresh,
  onRetry,
  className,
}: RecordsTabProps) {
  const latestRecord =
    records.length > 0 ? [...records].sort((a, b) => b.id - a.id)[0] : null;

  if (loading && records.length === 0) {
    return (
      <div className={className}>
        <RecordsTabSkeleton />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {records.length === 0
            ? "Sin expedientes clínicos para este paciente."
            : records.length === 1
              ? "1 expediente clínico registrado para este paciente."
              : `${records.length} expedientes clínicos registrados. Se muestra el más reciente.`}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Actualizando…" : "Actualizar"}
        </Button>
      </div>

      {error && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      )}

      {!error && !latestRecord && (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            {patientFullName(patient)} aún no tiene expediente clínico.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link to="/records/new">Crear expediente</Link>
          </Button>
        </div>
      )}

      {latestRecord && (
        <RecordResume record={latestRecord} className={refreshing ? "opacity-60" : undefined} />
      )}
    </div>
  );
}
