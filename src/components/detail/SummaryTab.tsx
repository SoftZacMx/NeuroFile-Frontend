import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LastActivitySummary } from "./LastActivitySummary";
import { LastClinicalNotes } from "./LastClinicalNotes";
import type { PatientSummary } from "@/types/summary";
import type { ClinicalNote } from "./LastClinicalNotes";

function formatSummaryDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return format(d, "d MMM yyyy - HH:mm", { locale: es });
}

function formatSummaryDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return format(d, "d MMM yyyy", { locale: es });
}

function summaryToDisplayNotes(summary: PatientSummary | null): ClinicalNote[] {
  if (!summary?.last4ClinicalNotes?.length) return [];
  return summary.last4ClinicalNotes.map((n) => ({
    doctorName: "Nota clínica",
    date: formatSummaryDate(n.date),
    content: n.note,
  }));
}

export interface SummaryTabProps {
  summary: PatientSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  onRefresh?: () => void;
}

export function SummaryTab({
  summary,
  summaryLoading,
  summaryError,
  onRefresh,
}: SummaryTabProps) {
  if (summaryLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center py-8">
        <p className="text-muted-foreground">Cargando resumen…</p>
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className="flex flex-col gap-2 py-4">
        <p className="text-destructive">{summaryError}</p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-sm text-primary hover:underline"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  const lastAppointment = summary?.lastAppointment ?? null;
  const lastNote = summary?.lastNote ?? null;
  const displayNotes = summaryToDisplayNotes(summary);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LastActivitySummary
          categoryLabel="ÚLTIMA CITA"
          title={lastAppointment ? "Consulta" : "Sin cita reciente"}
          dateTime={
            lastAppointment
              ? formatSummaryDateTime(lastAppointment.date)
              : "—"
          }
        />
        <LastActivitySummary
          categoryLabel="ÚLTIMA NOTA"
          title={lastNote ? "Nota clínica" : "Sin nota reciente"}
          dateTime={lastNote ? formatSummaryDateTime(lastNote.date) : "—"}
        />
      </div>
      <LastClinicalNotes notes={displayNotes} />
    </div>
  );
}
