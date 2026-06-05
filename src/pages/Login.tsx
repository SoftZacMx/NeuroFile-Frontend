import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CredentialsForm } from "@/components/auth/CredentialsForm";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { useAuth } from "@/contexts/AuthContext";
import type { CredentialsFormValues } from "@/hooks/useCredentialsForm";
import { login } from "@/services/auth";

export default function Login() {
  const { user, setAuth, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (values: CredentialsFormValues) => {
    const data = await login(api, values.email, values.password);
    setAuth(data, values.keepLoggedIn ?? false);
    navigate("/dashboard", { replace: true });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <AuthBrandPanel />

      {/* Columna derecha: formulario */}
      <div className="bg-background flex flex-col justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-sm mx-auto">
          <CredentialsForm
            noCard
            title="Iniciar Sesión"
            description="Bienvenido de nuevo a NeuroFile"
            emailLabel="Correo Electrónico"
            emailPlaceholder="ejemplo@clinica.com"
            passwordLabel="Contraseña"
            submitLabel="Acceder al Sistema"
            showForgotPasswordLink
            onForgotPassword={handleForgotPassword}
            showKeepLoggedIn
            keepLoggedInLabel="Mantener sesión iniciada"
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
