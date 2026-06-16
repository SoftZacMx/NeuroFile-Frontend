import { EmptyState } from "./EmptyState";
import type { EmptyStateAction } from "./EmptyState";

function IconUserPlus({ className }: { className?: string }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function IconClipboard({ className }: { className?: string }) {
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
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

export interface PacientesEmptyStateProps {
  /** Optional primary action (e.g. "Agregar paciente" that opens create dialog) */
  primaryAction?: EmptyStateAction;
}

export function PacientesEmptyState({
  primaryAction,
}: PacientesEmptyStateProps) {
  return (
    <EmptyState
      illustration={
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-primary/20 bg-background">
            <IconUserPlus className="h-14 w-14 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted">
            <IconClipboard className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      }
      title="No hay pacientes registrados"
      description="Comienza a gestionar tu cartera de pacientes. Agrega tu primer paciente para empezar."
      primaryAction={primaryAction}
      helpText="¿Necesitas ayuda con la ficha de pacientes? Visita nuestro "
      helpLink="/help"
    />
  );
}
