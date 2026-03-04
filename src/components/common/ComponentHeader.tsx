import { cn } from "@/lib/utils";

export interface ComponentHeaderProps {
  title: string;
  description?: string;
  /** Optional actions (e.g. Exportar CSV button) rendered on the right */
  actions?: React.ReactNode;
  className?: string;
}

export function ComponentHeader({
  title,
  description,
  actions,
  className,
}: ComponentHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="mt-2 shrink-0 sm:mt-0">{actions}</div>}
    </div>
  );
}
