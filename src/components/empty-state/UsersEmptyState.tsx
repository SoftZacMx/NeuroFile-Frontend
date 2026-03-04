import { EmptyState } from "./EmptyState";

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

function IconShield({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconImport({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export interface UsersEmptyStateProps {
  onCreateUser: () => void;
  onImportUsers?: () => void;
}

export function UsersEmptyState({
  onCreateUser,
  onImportUsers,
}: UsersEmptyStateProps) {
  return (
    <EmptyState
      illustration={
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-primary/20 bg-background">
            <IconUserPlus className="h-14 w-14 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted">
            <IconShield className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      }
      title="No hay usuarios registrados"
      description="Comienza a gestionar tu equipo médico. Crea el primer perfil de usuario para otorgar acceso seguro a la plataforma NeuroFile."
      primaryAction={{
        label: "Crear primer usuario",
        onClick: onCreateUser,
        icon: <IconUserPlus className="h-4 w-4" />,
      }}
      secondaryAction={
        onImportUsers
          ? {
              label: "Importar usuarios",
              onClick: onImportUsers,
              icon: <IconImport className="h-4 w-4" />,
            }
          : undefined
      }
      helpText="¿Necesitas ayuda con los roles de usuario? Visita nuestro "
      helpLink="/help"
    />
  );
}
