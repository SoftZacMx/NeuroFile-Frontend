import type { ApiResponse } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface ApiClientOptions {
  getToken: () => string | null;
  onUnauthorized?: () => void;
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

type RequestOptions = RequestInit & { body?: object | FormData };

function createApiClient(options: ApiClientOptions) {
  const { getToken, onUnauthorized } = options;

  async function request<T>(path: string, init: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { body, ...rest } = init;
    const token = getToken();
    const headers: HeadersInit = { ...rest.headers };
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    let fetchBody: BodyInit | undefined;
    if (body === undefined) {
      fetchBody = undefined;
    } else if (isFormData(body)) {
      fetchBody = body;
    } else {
      (headers as Record<string, string>)["Content-Type"] = "application/json";
      fetchBody = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers,
      body: fetchBody,
    } as RequestInit);
    const data = (await res.json().catch(() => ({}))) as ApiResponse<T>;
    if (res.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return { ...data, status_code: data.status_code ?? res.status };
  }

  return {
    get: <T>(path: string, init?: RequestInit) =>
      request<T>(path, { ...init, method: "GET" } as RequestOptions),
    post: <T>(path: string, body?: object, init?: RequestInit) => {
      const { body: _b, ...rest } = init ?? {};
      return request<T>(path, { ...rest, method: "POST", body } as RequestOptions);
    },
    postFormData: <T>(path: string, formData: FormData, init?: RequestInit) => {
      const { body: _b, ...rest } = init ?? {};
      return request<T>(path, { ...rest, method: "POST", body: formData } as RequestOptions);
    },
    put: <T>(path: string, body?: object, init?: RequestInit) => {
      const { body: _b, ...rest } = init ?? {};
      return request<T>(path, { ...rest, method: "PUT", body } as RequestOptions);
    },
    delete: <T>(path: string, init?: RequestInit) =>
      request<T>(path, { ...init, method: "DELETE" } as RequestOptions),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
export { createApiClient };
