import { cn } from "@/lib/utils";

export interface RecordSubSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function RecordSubSection({
  label,
  children,
  className,
}: RecordSubSectionProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
