import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { register } from "@/services/users";
import type { RegisterFormValues } from "@/components/auth/RegisterForm";

function NeuroFileLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-8 w-8"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

export default function Register() {
  const { api } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await register(api, values);
      toast.success("Usuario creado correctamente.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Error al registrar el usuario."
      );
      throw e;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-6 flex flex-col items-center gap-4">
        <NeuroFileLogo />
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">NeuroFile</h2>
          <p className="text-sm text-muted-foreground">
            SaaS de Gestión Médica Especializada
          </p>
        </div>
      </div>
      <RegisterForm
        onSubmit={handleSubmit}
        title="Crear cuenta"
        description="Complete los datos para registrar un nuevo usuario en la plataforma."
        submitLabel="Registrar usuario"
        loginPath="/login"
      />
    </div>
  );
}
