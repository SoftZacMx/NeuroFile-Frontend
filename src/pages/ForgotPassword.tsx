import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { useAuth } from "@/contexts/AuthContext";
import { forgotPassword } from "@/services/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { api } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmed = email.trim();
      if (!trimmed) {
        setError("El correo es obligatorio");
        return;
      }
      if (!EMAIL_REGEX.test(trimmed)) {
        setError("Correo no válido");
        return;
      }

      setLoading(true);
      try {
        const result = await forgotPassword(api, trimmed);
        setSuccessMessage(result.message);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al solicitar recuperación"
        );
      } finally {
        setLoading(false);
      }
    },
    [api, email]
  );

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <AuthBrandPanel />

      <div className="bg-background flex flex-col justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col gap-1 text-left pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Recuperar contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu
              contraseña.
            </p>
          </div>

          {successMessage ? (
            <div className="space-y-4">
              <p className="text-sm text-foreground">{successMessage}</p>
              <p className="text-sm text-muted-foreground">
                Revisa tu bandeja de entrada y la carpeta de spam.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Volver al inicio de sesión</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Correo electrónico</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="ejemplo@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? "border-destructive" : ""}
                />
                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                <Link to="/login" className="text-primary hover:underline">
                  Volver al inicio de sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
