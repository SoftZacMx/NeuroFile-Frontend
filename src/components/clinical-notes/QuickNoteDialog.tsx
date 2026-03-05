import { useState, useEffect } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface QuickNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { date: string; note: string }) => Promise<void>;
  patientName?: string;
  patientId?: number;
}

export function QuickNoteDialog({
  open,
  onOpenChange,
  onSubmit,
  patientName,
  patientId,
}: QuickNoteDialogProps) {
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setDate(new Date().toISOString().slice(0, 10));
      setNote("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ date, note: note.trim() });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay>
        <DialogContent className="max-w-2xl bg-card p-0">
          <DialogHeader className="flex flex-row items-center gap-2 border-b border-border px-6 py-4">
            <MedicalCrossIcon className="h-5 w-5 text-primary" />
            <DialogTitle className="flex-1 text-xl">Nueva Nota</DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Cerrar"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col">
            {patientName != null && (
              <div className="border-b border-border px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Paciente
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {patientName}
                  </span>
                  {patientId != null && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      ID: {patientId}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="border-b border-border px-6 py-4">
              <Label
                htmlFor="quick-note-date"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Fecha de Consulta
              </Label>
              <div className="relative mt-2">
                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="quick-note-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="flex-1 px-6 py-4">
              <h3 className="text-sm font-semibold text-foreground">
                Evolución y Diagnóstico
              </h3>
              <textarea
                id="quick-note-content"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Comience a escribir los hallazgos clínicos, evolución del paciente o plan de tratamiento..."
                className="mt-2 min-h-[180px] w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  disabled
                >
                  <PlusIcon className="mr-1 h-3.5 w-3.5" />
                  Diagnóstico
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  disabled
                >
                  <PlusIcon className="mr-1 h-3.5 w-3.5" />
                  Tratamiento
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  disabled
                >
                  <PlusIcon className="mr-1 h-3.5 w-3.5" />
                  Laboratorio
                </Button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-input bg-muted/50 text-muted-foreground hover:bg-muted"
                  aria-label="Dictar"
                  disabled
                >
                  <MicIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-border px-6 py-4">
              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                <SaveNoteIcon className="mr-2 h-4 w-4" />
                {submitting ? "Guardando..." : "Guardar Nota"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}

function MedicalCrossIcon({ className }: { className?: string }) {
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
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
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
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function SaveNoteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}
