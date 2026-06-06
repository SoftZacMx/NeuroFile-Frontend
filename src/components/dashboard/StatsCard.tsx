import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  /** Etiqueta (ej. "Pacientes activos") */
  label: string;
  /** Valor principal (número o texto) */
  value: number | string;
  /** Icono que se muestra a la izquierda */
  icon: React.ReactNode;
  className?: string;
  /** Ruta de navegación al hacer clic (opcional) */
  to?: string;
  /** Acción al hacer clic (opcional; prioridad sobre `to` si ambos existen) */
  onClick?: () => void;
  /** Etiqueta accesible cuando la tarjeta es clicable */
  ariaLabel?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  className,
  to,
  onClick,
  ariaLabel,
}: StatsCardProps) {
  const isInteractive = Boolean(to || onClick);

  const card = (
    <Card
      className={cn(
        "rounded-lg shadow-sm",
        isInteractive &&
          "transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </span>
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel ?? `${label}: ${value}`}
        className="block w-full rounded-lg text-left outline-none"
      >
        {card}
      </button>
    );
  }

  if (!to) {
    return card;
  }

  return (
    <Link
      to={to}
      aria-label={ariaLabel ?? `${label}: ${value}`}
      className="block rounded-lg outline-none"
    >
      {card}
    </Link>
  );
}
