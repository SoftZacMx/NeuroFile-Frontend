import { cn } from "@/lib/utils";

export interface RecordCardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Highlighted block (e.g. estado neurocognitivo) */
  variant?: "default" | "highlight";
}

export function RecordCard({
  title,
  icon,
  children,
  className,
  variant = "default",
}: RecordCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variant === "highlight"
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-muted/30",
        className
      )}
    >
      {(title || icon) && (
        <div className="mb-2 flex items-center gap-2">
          {icon}
          {title && (
            <span className="text-sm font-semibold text-foreground">
              {title}
            </span>
          )}
        </div>
      )}
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
