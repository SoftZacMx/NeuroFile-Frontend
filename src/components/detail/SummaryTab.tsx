import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LastActivitySummary } from "./LastActivitySummary";
import { LastClinicalNotes } from "./LastClinicalNotes";
import { SummaryTabSkeleton } from "./SummaryTabSkeleton";
import { Button } from "@/components/ui/button";
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

function truncateNote(text: string, maxLength = 80): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

function summaryToDisplayNotes(summary: PatientSummary | null): ClinicalNote[] {
  if (!summary?.last4ClinicalNotes?.length) return [];
  return summary.last4ClinicalNotes.map((n) => ({
    doctorName: "Nota clínica",
    date: formatSummaryDate(n.date),
    content: truncateNote(n.note),
  }));
}

export type SummaryTabId = "appointments" | "notes";

export interface SummaryTabProps {
  summary: PatientSummary | null;
  summaryLoading: boolean;
  summaryRefreshing?: boolean;
  summaryError: string | null;
  onRefresh?: () => void;
  onNavigateToTab?: (tabId: SummaryTabId) => void;
}

export function SummaryTab({
  summary,
  summaryLoading,
  summaryRefreshing = false,
  summaryError,
  onRefresh,
  onNavigateToTab,
}: SummaryTabProps) {
  if (summaryLoading && !summary) {
    return <SummaryTabSkeleton />;
  }

  if (summaryError && !summary) {
    return (
      <div className="flex flex-col gap-2 py-4">
        <p className="text-destructive">{summaryError}</p>
        {onRefresh && (
          <Button type="button" variant="outline" size="sm" onClick={onRefresh}>
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  const nextAppointment = summary?.nextAppointment ?? null;
  const lastNote = summary?.lastNote ?? null;
  const displayNotes = summaryToDisplayNotes(summary);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Vista rápida de la actividad reciente del paciente.
        </p>
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={summaryRefreshing}
          >
            {summaryRefreshing ? "Actualizando…" : "Actualizar"}
          </Button>
        )}
      </div>

      {summaryError && (
        <p className="text-sm text-destructive">{summaryError}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LastActivitySummary
          categoryLabel="Próxima cita"
          title={nextAppointment ? "Consulta programada" : "Sin cita programada"}
          dateTime={
            nextAppointment ? formatSummaryDateTime(nextAppointment.date) : "—"
          }
          onClick={
            onNavigateToTab ? () => onNavigateToTab("appointments") : undefined
          }
        />
        <LastActivitySummary
          categoryLabel="Última nota"
          title={
            lastNote ? truncateNote(lastNote.note, 48) : "Sin nota reciente"
          }
          dateTime={lastNote ? formatSummaryDateTime(lastNote.date) : "—"}
          onClick={onNavigateToTab ? () => onNavigateToTab("notes") : undefined}
        />
      </div>

      <LastClinicalNotes
        notes={displayNotes}
        headerAction={
          onNavigateToTab ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto px-0"
              onClick={() => onNavigateToTab("notes")}
            >
              Ver todas
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
