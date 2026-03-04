import { cn } from "@/lib/utils";

export interface ClinicalNoteItemProps {
  doctorName: string;
  date: string;
  content: string;
  className?: string;
}

function IconMenu({ className }: { className?: string }) {
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
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function ClinicalNoteItem({
  doctorName,
  date,
  content,
  className,
}: ClinicalNoteItemProps) {
  return (
    <div className={cn("relative flex gap-3 space-x-2 pl-8", className)}>
      <div className="absolute left-0 top-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
        <IconMenu className="h-4 w-4  space-x-2 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-semibold text-foreground">{doctorName}</span>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <p className="mt-1 text-sm text-foreground">{content}</p>
      </div>
    </div>
  );
}
