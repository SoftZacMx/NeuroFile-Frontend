import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

function IconUsers({ className }: { className?: string }) {
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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function DashboardQuickActions() {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      <Button asChild size="sm">
        <Link to="/patients?create=1">
          <IconUserPlus className="mr-2 h-4 w-4" />
          Crear paciente
        </Link>
      </Button>
      <Button variant="outline" asChild size="sm">
        <Link to="/patients">
          <IconUsers className="mr-2 h-4 w-4" />
          Ver pacientes
        </Link>
      </Button>
    </div>
  );
}
