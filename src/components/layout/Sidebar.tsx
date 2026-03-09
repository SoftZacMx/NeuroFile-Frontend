import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const MEDIA_MD = "(min-width: 768px)";

function useDefaultCollapsed(): boolean {
  const [defaultCollapsed, setDefaultCollapsed] = useState(() =>
    typeof window !== "undefined" ? !window.matchMedia(MEDIA_MD).matches : false
  );
  useEffect(() => {
    const m = window.matchMedia(MEDIA_MD);
    const handler = () => setDefaultCollapsed(!m.matches);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);
  return defaultCollapsed;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { to: "/patients", label: "Pacientes", icon: IconPacientes },
  { to: "/records", label: "Expedientes", icon: IconExpediente },
] as const;

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconPacientes({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconExpediente({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <img
      src="/Logo2.jpg"
      alt="NeuroFile"
      className={cn("shrink-0 object-contain shadow-md rounded-lg", className)}
    />
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function Sidebar() {
  const { user, clearAuth } = useAuth();
  const defaultCollapsed = useDefaultCollapsed();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  const roleLabel = user?.role === "admin" ? "Admin Principal" : "Terapeuta";
  const displayName = user ? `${user.first_name} ${user.last_name}` : "Usuario";

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-[width] duration-200 ease-in-out",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <div className={cn("flex flex-col gap-1", isCollapsed ? "p-2" : "p-4")}>
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "flex-col justify-center gap-1" : "gap-3"
          )}
        >
          <LogoIcon className={cn("shrink-0", isCollapsed ? "h-8 w-8" : "h-10 w-10")} />
          <div className={cn("flex min-w-0 flex-col overflow-hidden", isCollapsed && "hidden")}>
            <span className="truncate font-semibold text-card-foreground">
              NeuroFile
            </span>
            <span className="truncate text-xs text-muted-foreground">
              SaaS Médico
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed((c) => !c)}
            title={isCollapsed ? "Expandir barra" : "Colapsar barra"}
            className={cn(
              "shrink-0 rounded-lg p-2 text-muted-foreground transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              !isCollapsed && "ml-auto"
            )}
          >
            {isCollapsed ? (
              <IconChevronRight className="h-5 w-5" />
            ) : (
              <IconChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <nav className={cn("flex flex-1 flex-col gap-0.5 py-2", isCollapsed ? "px-1" : "px-2")}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isCollapsed ? "justify-center px-2" : "gap-3",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={cn("border-t border-border", isCollapsed ? "p-2" : "p-4")}>
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "flex-col justify-center gap-2"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
            {displayName.charAt(0)}
          </div>
          <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden", isCollapsed && "hidden")}>
            <span className="truncate text-sm font-medium text-card-foreground">
              {displayName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {roleLabel}
            </span>
          </div>
          <ThemeToggle iconOnly={isCollapsed} className={isCollapsed ? "" : "flex items-center"} />
          <button
            type="button"
            onClick={clearAuth}
            title="Cerrar sesión"
            className={cn(
              "shrink-0 rounded-lg p-2 text-muted-foreground transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            <IconLogout className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
