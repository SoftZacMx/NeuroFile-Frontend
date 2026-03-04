import type { ApiResponse } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface ApiClientOptions {
  getToken: () => string | null;
  onUnauthorized?: () => void;
}

function createApiClient(options: ApiClientOptions) {
  const { getToken, onUnauthorized } = options;

  async function request<T>(
    path: string,
    init: RequestInit & { body?: object } = {}
  ): Promise<ApiResponse<T>> {
    const { body, ...rest } = init;
    const token = getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...rest.headers,
    };
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers,
      body: body ? JSON.stringify(body) : rest.body,
    });
    const data = (await res.json().catch(() => ({}))) as ApiResponse<T>;
    if (res.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return { ...data, status_code: data.status_code ?? res.status };
  }

  return {
    get: <T>(path: string, init?: RequestInit) =>
      request<T>(path, { ...init, method: "GET" }),
    post: <T>(path: string, body?: object, init?: RequestInit) =>
      request<T>(path, { ...init, method: "POST", body }),
    put: <T>(path: string, body?: object, init?: RequestInit) =>
      request<T>(path, { ...init, method: "PUT", body }),
    delete: <T>(path: string, init?: RequestInit) =>
      request<T>(path, { ...init, method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
export { createApiClient };
