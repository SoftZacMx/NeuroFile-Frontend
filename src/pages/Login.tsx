import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CredentialsForm } from "@/components/auth/CredentialsForm";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/services/auth";

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

export default function Login() {
  const { user, setAuth, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const path = user.role === "admin" ? "/dashboard" : "/dashboard";
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    const data = await login(api, values.email, values.password);
    setAuth(data);
    const path = data.user.role === "admin" ? "/dashboard" : "/dashboard";
    navigate(path, { replace: true });
  };

  const handleForgotPassword = () => {
    // TODO: navegar a recuperar contraseña o abrir modal
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="flex flex-col items-center gap-4 mb-6">
        <NeuroFileLogo />
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">NeuroFile</h2>
          <p className="text-sm text-muted-foreground">
            SaaS de Gestión Médica Especializada
          </p>
        </div>
      </div>
      <CredentialsForm
        title="Iniciar sesión"
        description="Ingrese sus credenciales para acceder al panel"
        emailPlaceholder="doctor@neurofile.com"
        submitLabel="Acceder al Sistema"
        showForgotPasswordLink
        onForgotPassword={handleForgotPassword}
        showKeepLoggedIn
        keepLoggedInLabel="Mantener sesión iniciada"
        footer={
          <>
            ¿No tiene una cuenta?{" "}
            <Link to="/auth/register" className="text-primary hover:underline">
              Crear cuenta
            </Link>
          </>
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
}
