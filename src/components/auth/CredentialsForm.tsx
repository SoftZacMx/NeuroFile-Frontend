import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { UseCredentialsFormOptions } from "@/hooks/useCredentialsForm";
import { useCredentialsForm } from "@/hooks/useCredentialsForm";

export interface CredentialsFormProps extends UseCredentialsFormOptions {
  title?: string;
  description?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  submitLabel?: string;
  showForgotPasswordLink?: boolean;
  onForgotPassword?: () => void;
  showKeepLoggedIn?: boolean;
  keepLoggedInLabel?: string;
  /** Logo node (e.g. image or icon) */
  logo?: React.ReactNode;
  /** Footer content (e.g. "¿No tiene cuenta? Contacte con soporte") */
  footer?: React.ReactNode;
  /** Si true, no usa Card (para layout de dos columnas) */
  noCard?: boolean;
  className?: string;
}

export function CredentialsForm({
  title = "Iniciar sesión",
  description = "Ingrese sus credenciales para acceder al panel",
  emailLabel = "Correo Electrónico",
  emailPlaceholder = "doctor@neurofile.com",
  passwordLabel = "Contraseña",
  submitLabel = "Acceder al Sistema",
  showForgotPasswordLink = true,
  onForgotPassword,
  showKeepLoggedIn = true,
  keepLoggedInLabel = "Mantener sesión iniciada",
  logo,
  footer,
  noCard = false,
  className,
  ...hookOptions
}: CredentialsFormProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    keepLoggedIn,
    setKeepLoggedIn,
    showPassword,
    setShowPassword,
    loading,
    errors,
    handleSubmit,
  } = useCredentialsForm(hookOptions);

  const Wrapper = noCard ? "div" : Card;
  const Header = noCard ? "div" : CardHeader;
  const Content = noCard ? "div" : CardContent;

  return (
    <Wrapper className={cn(noCard ? "w-full max-w-sm" : "w-full max-w-md", className)}>
      <Header className={cn(noCard ? "flex flex-col gap-1 text-left pb-6" : "flex flex-col items-center gap-2 text-center")}>
        {logo && !noCard && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            {logo}
          </div>
        )}
        <h1 className={cn("font-bold tracking-tight", noCard ? "text-2xl text-foreground" : "text-2xl")}>{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Header>
      <Content className={cn(noCard && "p-0")}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="credentials-email">{emailLabel}</Label>
            <div className="relative">
              {noCard && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              )}
              <Input
                id="credentials-email"
                type="email"
                autoComplete="email"
                placeholder={emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(errors.email ? "border-destructive" : "", noCard && "pl-9")}
                data-testid="login-email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="credentials-password">{passwordLabel}</Label>
              {showForgotPasswordLink && onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div className="relative">
              {noCard && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
              )}
              <Input
                id="credentials-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "pr-9",
                  errors.password ? "border-destructive" : "",
                  noCard && "pl-9"
                )}
                data-testid="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>
          {showKeepLoggedIn && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="credentials-keep"
                checked={keepLoggedIn}
                onCheckedChange={(v) => setKeepLoggedIn(!!v)}
              />
              <Label htmlFor="credentials-keep" className="font-normal cursor-pointer">
                {keepLoggedInLabel}
              </Label>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading} data-testid="login-submit">
            {loading ? "..." : submitLabel}
            <span className="ml-1" aria-hidden>→</span>
          </Button>
        </form>
        {footer && (
          <p className={cn("mt-4 text-sm text-muted-foreground", noCard ? "text-left" : "text-center")}>
            {footer}
          </p>
        )}
      </Content>
    </Wrapper>
  );
}
