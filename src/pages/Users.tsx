import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUsers } from "@/services/users";
import type { User } from "@/types/auth";
import { UsersEmptyState } from "@/components/empty-state/UsersEmptyState";
import { Button } from "@/components/ui/button";

export default function Users() {
  const { api } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(api);
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = () => {
    // TODO: abrir modal o navegar a formulario crear usuario
  };

  const handleImportUsers = () => {
    // TODO: flujo de importar usuarios
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <p className="text-muted-foreground">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-2" onClick={loadUsers}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!users?.length) {
    return (
      <UsersEmptyState
        onCreateUser={handleCreateUser}
        onImportUsers={handleImportUsers}
      />
    );
  }

  return (
    <div className="p-6">
      <p className="text-muted-foreground">
        {users.length} usuario(s) registrado(s). (Lista/tabla en siguiente paso.)
      </p>
    </div>
  );
}
