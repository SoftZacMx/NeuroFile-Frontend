import type { User } from "@/types/auth";
import type { ApiClient } from "@/lib/api-client";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  middle_last_name?: string | null;
  email: string;
  password: string;
  phone: string;
  role: string;
  is_active?: boolean;
}

export async function register(
  api: ApiClient,
  payload: RegisterPayload
): Promise<User> {
  const body = {
    ...payload,
    is_active: payload.is_active ?? true,
  };
  const res = await api.post<User>("/users", body);
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al crear el usuario");
  }
  return res.data;
}

export async function getUsers(api: ApiClient): Promise<User[]> {
  const res = await api.get<User[]>("/users");
  if (res.error || res.data === null) {
    throw new Error(res.message ?? "Error al obtener usuarios");
  }
  return Array.isArray(res.data) ? res.data : [];
}
