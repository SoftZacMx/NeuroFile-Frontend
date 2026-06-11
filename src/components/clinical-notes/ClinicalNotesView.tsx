import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getClinicalNotes, createClinicalNote } from "@/services/clinicalNotes";
import type { ClinicalNote } from "@/types/clinical-note";
import { ComponentHeader } from "@/components/common/ComponentHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotesTabSkeleton } from "@/components/detail/NotesTabSkeleton";
import { NotaClinica } from "./NotaClinica";
import { QuickNoteDialog } from "./QuickNoteDialog";

export interface ClinicalNotesViewProps {
  recordId: number;
  patientName?: string;
  patientId?: number;
  onNoteCreated?: () => void;
  className?: string;
}

export function ClinicalNotesView({
  recordId,
  patientName,
  patientId,
  onNoteCreated,
  className,
}: ClinicalNotesViewProps) {
  const { api } = useAuth();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const loadNotes = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const list = await getClinicalNotes(api, recordId, {
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        });
        setNotes(list);
      } catch (e) {
        if (!isRefresh) {
          setNotes([]);
        }
        setError(
          e instanceof Error ? e.message : "Error al cargar las notas clínicas"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [api, recordId, dateFrom, dateTo]
  );

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleQuickNoteSubmit = useCallback(
    async (payload: { date: string; note: string }) => {
      await createClinicalNote(api, {
        ...payload,
        recordId,
      });
      await loadNotes(true);
      onNoteCreated?.();
    },
    [api, recordId, loadNotes, onNoteCreated]
  );

  const hasDateFilter = Boolean(dateFrom || dateTo);

  const newNoteButton = (
    <Button size="sm" onClick={() => setQuickNoteOpen(true)}>
      <PlusIcon className="mr-2 h-4 w-4" />
      Nueva nota
    </Button>
  );

  if (loading && notes.length === 0) {
    return (
      <div className={className}>
        <NotesTabSkeleton />
      </div>
    );
  }

  return (
    <div className={`flex max-h-[70vh] flex-col gap-4 ${className ?? ""}`.trim()}>
      <ComponentHeader
        title="Notas Clínicas"
        description="Historial cronológico de intervenciones y observaciones detalladas."
        actions={newNoteButton}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {notes.length === 1
            ? "1 nota clínica registrada."
            : `${notes.length} notas clínicas registradas.`}
          {hasDateFilter ? " (filtro de fechas activo)" : ""}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => loadNotes(true)}
          disabled={refreshing}
        >
          {refreshing ? "Actualizando…" : "Actualizar"}
        </Button>
      </div>

      {error && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => loadNotes()}>
            Reintentar
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4 border-b border-border pb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Filtrar por fecha (opcional)
        </span>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes-date-from" className="text-xs text-muted-foreground">
            Desde
          </Label>
          <Input
            id="notes-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full min-w-[140px]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes-date-to" className="text-xs text-muted-foreground">
            Hasta
          </Label>
          <Input
            id="notes-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full min-w-[140px]"
          />
        </div>
        {hasDateFilter && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
          >
            Quitar filtro
          </Button>
        )}
      </div>

      <div className={`min-h-0 flex-1 overflow-y-auto ${refreshing ? "opacity-60" : ""}`}>
        {!error && notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {hasDateFilter
              ? "No hay notas en el rango seleccionado."
              : "Aún no hay notas clínicas. Use \"Nueva nota\" para crear la primera."}
          </p>
        ) : (
          !error && (
            <div className="relative mt-2">
              <div
                className="absolute left-[5px] top-0 bottom-0 w-px bg-border"
                aria-hidden
              />
              <div className="flex flex-col gap-6">
                {notes.map((note) => (
                  <NotaClinica key={note.id} note={note} />
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <QuickNoteDialog
        open={quickNoteOpen}
        onOpenChange={setQuickNoteOpen}
        onSubmit={handleQuickNoteSubmit}
        patientName={patientName}
        patientId={patientId}
      />
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
