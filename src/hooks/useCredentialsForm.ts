import { useCallback, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CredentialsFormValues {
  email: string;
  password: string;
  keepLoggedIn?: boolean;
}

export interface CredentialsFormErrors {
  email?: string;
  password?: string;
}

export interface UseCredentialsFormOptions {
  onSubmit: (values: CredentialsFormValues) => Promise<void>;
  initialKeepLoggedIn?: boolean;
}

export function useCredentialsForm(options: UseCredentialsFormOptions) {
  const { onSubmit, initialKeepLoggedIn = false } = options;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(initialKeepLoggedIn);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<CredentialsFormErrors>({});

  const validate = useCallback((): boolean => {
    const next: CredentialsFormErrors = {};
    if (!email.trim()) next.email = "El correo es obligatorio";
    else if (!EMAIL_REGEX.test(email)) next.email = "Correo no válido";
    if (!password) next.password = "La contraseña es obligatoria";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setLoading(true);
      setErrors({});
      try {
        await onSubmit({
          email: email.trim(),
          password,
          keepLoggedIn,
        });
      } catch (err) {
        setErrors({
          password:
            err instanceof Error ? err.message : "Error al iniciar sesión",
        });
      } finally {
        setLoading(false);
      }
    },
    [email, password, keepLoggedIn, onSubmit, validate]
  );

  return {
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
  };
}
