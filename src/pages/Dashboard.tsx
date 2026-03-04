import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, clearAuth } = useAuth();

  return (
    <div className="p-6">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={clearAuth}>
          Cerrar sesión
        </Button>
      </header>
      <main className="mt-6">
        <p className="text-muted-foreground">
          {user?.role === "admin"
            ? "Vista de administrador: acceso a usuarios y todos los pacientes."
            : "Vista de terapeuta: acceso a sus pacientes."}
        </p>
      </main>
    </div>
  );
}
