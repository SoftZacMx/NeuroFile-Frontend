import { cn } from "@/lib/utils";

const TAG_COLORS = [
  "bg-destructive/15 text-destructive",
  "bg-warning/15 text-warning",
  "bg-primary/15 text-primary",
  "bg-muted text-muted-foreground",
  "bg-success/15 text-success",
];

export interface SymptomTagsProps {
  symptoms: { id: number; detail: string }[];
  className?: string;
}

export function SymptomTags({ symptoms, className }: SymptomTagsProps) {
  if (!symptoms?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {symptoms.map((s, i) => (
        <span
          key={s.id}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            TAG_COLORS[i % TAG_COLORS.length]
          )}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-75" />
          {s.detail}
        </span>
      ))}
    </div>
  );
}
