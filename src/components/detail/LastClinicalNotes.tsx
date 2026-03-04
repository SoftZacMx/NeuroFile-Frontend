import { cn } from "@/lib/utils";
import { ClinicalNoteItem } from "./ClinicalNoteItem";

export interface ClinicalNote {
  doctorName: string;
  date: string;
  content: string;
}

export interface LastClinicalNotesProps {
  notes: ClinicalNote[];
  title?: string;
  className?: string;
}

export function LastClinicalNotes({
  notes,
  title = "Notas Clínicas",
  className,
}: LastClinicalNotesProps) {
  if (notes.length === 0) {
    return (
      <section className={cn("space-y-4", className)}>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">No hay notas clínicas.</p>
      </section>
    );
  }

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="relative">
        <div
          className="absolute left-4 top-0 bottom-0 w-px bg-border"
          aria-hidden
        />
        <div className="flex flex-col gap-6">
          {notes.map((note, index) => (
            <ClinicalNoteItem
              key={index}
              doctorName={note.doctorName}
              date={note.date}
              content={note.content}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
