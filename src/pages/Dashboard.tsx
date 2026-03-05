import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
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
