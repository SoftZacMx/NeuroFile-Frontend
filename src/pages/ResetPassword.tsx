import { useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { useAuth } from "@/contexts/AuthContext";
import { resetPassword } from "@/services/auth";

export default function ResetPassword() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const next: Record<string, string> = {};
    if (!password) next.password = "La contraseña es obligatoria";
    else if (password.length < 6) next.password = "Mínimo 6 caracteres";
    if (!confirmPassword) next.confirmPassword = "Confirma tu contraseña";
    else if (password !== confirmPassword) {
      next.confirmPassword = "Las contraseñas no coinciden";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [password, confirmPassword]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token) {
        setErrors({ submit: "Enlace inválido o expirado" });
        return;
      }
      if (!validate()) return;

      setLoading(true);
      setErrors({});
      try {
        const result = await resetPassword(api, token, password);
        toast.success(result.message);
        navigate("/login", { replace: true });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al restablecer la contraseña";
        setErrors({ submit: message });
      } finally {
        setLoading(false);
      }
    },
    [api, navigate, password, token, validate]
  );

  if (!token) {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <AuthBrandPanel />
        <div className="bg-background flex flex-col justify-center p-6 md:p-12 lg:p-16">
          <div className="w-full max-w-sm mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              Enlace no válido
            </h1>
            <p className="text-sm text-muted-foreground">
              El enlace de recuperación es inválido o ha expirado. Solicita uno
              nuevo.
            </p>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Solicitar nuevo enlace</Link>
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <AuthBrandPanel />

      <div className="bg-background flex flex-col justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col gap-1 text-left pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Nueva contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Elige una contraseña segura para tu cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? "border-destructive pr-9" : "pr-9"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-confirm">Confirmar contraseña</Label>
              <Input
                id="reset-confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-xs text-destructive">{errors.submit}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Restablecer contraseña"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              <Link to="/login" className="text-primary hover:underline">
                Volver al inicio de sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
