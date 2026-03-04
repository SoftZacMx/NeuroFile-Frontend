import type { ApiResponse } from "@/types/api";
import type { LoginResponse, User } from "@/types/auth";
import type { ApiClient } from "@/lib/api-client";

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
