import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface LastActivitySummaryProps {
  /** Etiqueta de categoría (ej. "PRÓXIMA CITA", "ÚLTIMA CITA") */
  categoryLabel: string;
  /** Título de la actividad (ej. "Consulta de Seguimiento") */
  title: string;
  /** Fecha y hora formateada (ej. "25 Oct 2023 - 10:00 AM") */
  dateTime: string;
  /** Icono opcional; si no se pasa, se usa el de calendario por defecto */
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function IconCalendar({ className }: { className?: string }) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function LastActivitySummary({
  categoryLabel,
  title,
  dateTime,
  icon,
  className,
  onClick,
}: LastActivitySummaryProps) {
  const content = (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
            {icon ?? <IconCalendar className="h-5 w-5" />}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {categoryLabel}
          </span>
        </div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{dateTime}</p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <Card
        className={cn(
          "rounded-lg shadow-sm transition-colors hover:bg-muted/30",
          className
        )}
      >
        <button
          type="button"
          onClick={onClick}
          className="w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CardContent className="p-4">{content}</CardContent>
        </button>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-lg shadow-sm", className)}>
      <CardContent className="p-4">{content}</CardContent>
    </Card>
  );
}
