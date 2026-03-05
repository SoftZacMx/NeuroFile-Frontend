import { cn } from "@/lib/utils";
import type { ClinicalNote as ClinicalNoteType } from "@/types/clinical-note";

export interface NotaClinicaProps {
  note: ClinicalNoteType;
  className?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NotaClinica({ note, className }: NotaClinicaProps) {
  return (
    <div
      className={cn(
        "relative flex gap-3 pl-8",
        className
      )}
      role="article"
      aria-label={`Nota del ${formatDate(note.date)}`}
    >
      <div
        className="absolute left-0 top-2 h-3 w-3 shrink-0 rounded-full border-2 border-border bg-muted"
        aria-hidden
      />
      <div className="min-w-0 flex-1 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {formatDate(note.date)}
          </span>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
          {note.note}
        </p>
      </div>
    </div>
  );
}
