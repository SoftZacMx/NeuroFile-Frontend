import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CredentialsForm } from "@/components/auth/CredentialsForm";
import { useAuth } from "@/contexts/AuthContext";
import { login } from "@/services/auth";

export default function Login() {
  const { user, setAuth, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    const data = await login(api, values.email, values.password);
    setAuth(data);
    navigate("/dashboard", { replace: true });
  };

  const handleForgotPassword = () => {
    // TODO: navegar a recuperar contraseña o abrir modal
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Columna izquierda: logo y texto */}
      <div className="bg-muted/40 flex flex-col items-center justify-center p-8 md:p-12">
        <img
          src="/NeuroFileLogo.png"
          alt="NeuroFile"
          className="w-32 h-32 md:w-80 md:h-80 object-contain mb-6"
        />
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center">
          Plataforma Integral De Gestión Clínica
        </h2>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
          Eficiencia y precisión en la gestión de expedientes clínicos.
        </p>
      </div>

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
            footer={
              <>
                ¿No tienes cuenta?{" "}
                <a href="#" className="text-primary hover:underline">
                  Contacta a soporte
                </a>
              </>
            }
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
