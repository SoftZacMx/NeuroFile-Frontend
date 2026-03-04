import { cn } from "@/lib/utils";

const TAG_COLORS = [
  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
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
