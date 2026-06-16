import type { User } from "@/types/auth";
import { Button } from "@/components/ui/button";

function formatTodayDate(): string {
  const formatted = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function IconRefresh({ className }: { className?: string }) {
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
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export interface DashboardHeaderProps {
  user: User | null;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function DashboardHeader({ user, onRefresh, refreshing }: DashboardHeaderProps) {
  const displayName = user ? user.first_name : "Usuario";

  return (
    <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">{getGreeting()}</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">{displayName}</h1>
      </div>
      <div className="flex flex-col items-end gap-2 text-right">
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              title="Actualizar dashboard"
              aria-label="Actualizar dashboard"
            >
              <IconRefresh className={cnRefreshIcon(refreshing)} />
              Actualizar
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{formatTodayDate()}</p>
      </div>
    </header>
  );
}

function cnRefreshIcon(refreshing?: boolean): string {
  return refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4";
}
