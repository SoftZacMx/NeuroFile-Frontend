import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RegisterPayload } from "@/services/users";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_ROLE = "therapist";

export interface RegisterFormValues extends RegisterPayload {}

export interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  title?: string;
  description?: string;
  submitLabel?: string;
  loginPath?: string;
  className?: string;
}

export function RegisterForm({
  onSubmit,
  title = "Crear cuenta",
  description = "Complete los datos para registrar un nuevo usuario",
  submitLabel = "Registrar usuario",
  loginPath = "/login",
  className,
}: RegisterFormProps) {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [middle_last_name, setMiddle_last_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const next: Record<string, string> = {};
    if (!first_name.trim()) next.first_name = "El nombre es obligatorio";
    if (!last_name.trim()) next.last_name = "Los apellidos son obligatorios";
    if (!email.trim()) next.email = "El correo es obligatorio";
    else if (!EMAIL_REGEX.test(email)) next.email = "Correo no válido";
    if (!phone.trim()) next.phone = "El teléfono es obligatorio";
    if (!password) next.password = "La contraseña es obligatoria";
    else if (password.length < 6) next.password = "Mínimo 6 caracteres";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [first_name, last_name, email, phone, password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setLoading(true);
      setErrors({});
      try {
        await onSubmit({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          middle_last_name: middle_last_name.trim() || null,
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: DEFAULT_ROLE,
          is_active: true,
        });
      } catch (err) {
        setErrors({
          submit: err instanceof Error ? err.message : "Error al registrar",
        });
      } finally {
        setLoading(false);
      }
    },
    [
      first_name,
      last_name,
      middle_last_name,
      email,
      phone,
      password,
      onSubmit,
      validate,
    ]
  );

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="register-first_name">Nombre</Label>
              <Input
                id="register-first_name"
                type="text"
                autoComplete="given-name"
                placeholder="Ej. Juan"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
                className={errors.first_name ? "border-destructive" : ""}
              />
              {errors.first_name && (
                <p className="text-xs text-destructive">{errors.first_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-last_name">Apellidos</Label>
              <Input
                id="register-last_name"
                type="text"
                autoComplete="family-name"
                placeholder="Ej. Pérez García"
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
                className={errors.last_name ? "border-destructive" : ""}
              />
              {errors.last_name && (
                <p className="text-xs text-destructive">{errors.last_name}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-middle_last_name">
              Apellido materno (opcional)
            </Label>
            <Input
              id="register-middle_last_name"
              type="text"
              autoComplete="family-name"
              placeholder="Opcional"
              value={middle_last_name}
              onChange={(e) => setMiddle_last_name(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Correo electrónico</Label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-phone">Teléfono</Label>
            <Input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+34 600 000 000"
              maxLength={13}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Contraseña</Label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "pr-9",
                  errors.password ? "border-destructive" : ""
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>
          {errors.submit && (
            <p className="text-xs text-destructive">{errors.submit}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : submitLabel}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tiene cuenta?{" "}
          <Link to={loginPath} className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
