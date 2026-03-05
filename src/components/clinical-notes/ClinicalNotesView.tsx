import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getClinicalNotes, createClinicalNote } from "@/services/clinicalNotes";
import type { ClinicalNote } from "@/types/clinical-note";
import { ComponentHeader } from "@/components/common/ComponentHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotaClinica } from "./NotaClinica";
import { QuickNoteDialog } from "./QuickNoteDialog";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function oneWeekAgoISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

export interface ClinicalNotesViewProps {
  recordId: number | null;
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
  const [loading, setLoading] = useState(false);
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<string>(() => oneWeekAgoISO());
  const [dateTo, setDateTo] = useState<string>(() => todayISO());

  const loadNotes = useCallback(async () => {
    if (recordId == null) {
      setNotes([]);
      return;
    }
    setLoading(true);
    try {
      const list = await getClinicalNotes(api, recordId, {
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setNotes(list);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [api, recordId, dateFrom, dateTo]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleQuickNoteSubmit = useCallback(
    async (payload: { date: string; note: string }) => {
      if (recordId == null) return;
      await createClinicalNote(api, {
        ...payload,
        recordId,
      });
      await loadNotes();
      onNoteCreated?.();
    },
    [api, recordId, loadNotes, onNoteCreated]
  );

  const newNoteButton = (
    <Button
      size="sm"
      onClick={() => setQuickNoteOpen(true)}
      disabled={recordId == null}
      title={
        recordId == null
          ? "Cree un expediente en la pestaña Expedientes para agregar notas."
          : undefined
      }
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      Nueva nota
    </Button>
  );

  if (recordId == null) {
    return (
      <div className={className}>
        <ComponentHeader
          title="Notas Clínicas"
          description="Historial cronológico de intervenciones y observaciones detalladas."
          actions={newNoteButton}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Este paciente no tiene expediente clínico. Cree un expediente en la
          pestaña Expedientes para poder agregar notas clínicas.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex max-h-[70vh] flex-col ${className ?? ""}`}>
      <ComponentHeader
        title="Notas Clínicas"
        description="Historial cronológico de intervenciones y observaciones detalladas."
        actions={newNoteButton}
      />

      <div className="flex flex-wrap items-end gap-4 border-b border-border py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Filtrar por fecha
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
        {(dateFrom !== oneWeekAgoISO() || dateTo !== todayISO()) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              setDateFrom(oneWeekAgoISO());
              setDateTo(todayISO());
            }}
          >
            Restablecer
          </Button>
        )}
        {(dateFrom || dateTo) && (
          <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
            {notes.length} notas
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Cargando notas…</p>
        ) : notes.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No hay notas clínicas en el rango de fechas. Use &quot;Nueva nota&quot;
            para crear la primera.
          </p>
        ) : (
          <div className="relative mt-6">
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
