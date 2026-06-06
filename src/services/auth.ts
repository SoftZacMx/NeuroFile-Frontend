import type { LoginResponse, User } from "@/types/auth";
import type { ApiClient } from "@/lib/api-client";

export interface MessageResponse {
  message: string;
}

export async function login(
  api: ApiClient,
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", { email, password });
  if (res.error || !res.data) {
    throw new Error(res.message ?? "Error al iniciar sesión");
  }
  return res.data;
}

export async function verifyUser(
  api: ApiClient,
  email: string
): Promise<User | null> {
  const res = await api.post<User | null>("/auth/verify-user", { email });
  if (res.error) return null;
  return res.data ?? null;
}

export async function forgotPassword(
  api: ApiClient,
  email: string
): Promise<MessageResponse> {
  const res = await api.post<MessageResponse>("/auth/forgot-password", { email });
  if (res.error) {
    throw new Error(res.message ?? "Error al solicitar recuperación de contraseña");
  }
  return {
    message:
      res.data?.message ??
      res.message ??
      "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
  };
}

export async function resetPassword(
  api: ApiClient,
  token: string,
  password: string
): Promise<MessageResponse> {
  const res = await api.post<MessageResponse>("/auth/reset-password", {
    token,
    password,
  });
  if (res.error) {
    throw new Error(res.message ?? "Error al restablecer la contraseña");
  }
  return {
    message: res.data?.message ?? res.message ?? "Contraseña actualizada correctamente",
  };
}
