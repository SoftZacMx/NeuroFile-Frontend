import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { createApiClient, type ApiClient } from "@/lib/api-client";
import type { LoginResponse, User } from "@/types/auth";

const STORAGE_KEY = "neurofile_auth";

function parseStored(raw: string | null): { token: string; user: User } | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as LoginResponse;
    if (data?.token && data?.user) return { token: data.token, user: data.user };
  } catch {
    /* ignore */
  }
  return null;
}

function loadStored(): { token: string; user: User } | null {
  return (
    parseStored(sessionStorage.getItem(STORAGE_KEY)) ??
    parseStored(localStorage.getItem(STORAGE_KEY))
  );
}

function clearStoredAuth(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
}

interface AuthState {
  token: string | null;
  user: User | null;
  ready: boolean;
}

interface AuthContextValue extends AuthState {
  setAuth: (data: LoginResponse, keepLoggedIn?: boolean) => void;
  clearAuth: () => void;
  api: ApiClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>(() => {
    const stored = loadStored();
    return {
      token: stored?.token ?? null,
      user: stored?.user ?? null,
      ready: true,
    };
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearAuth = useCallback(() => {
    clearStoredAuth();
    setState((s) => ({ ...s, token: null, user: null }));
    navigate("/login", { replace: true });
  }, [navigate]);

  const setAuth = useCallback((data: LoginResponse, keepLoggedIn = false) => {
    const serialized = JSON.stringify(data);
    if (keepLoggedIn) {
      localStorage.setItem(STORAGE_KEY, serialized);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, serialized);
      localStorage.removeItem(STORAGE_KEY);
    }
    setState({
      token: data.token,
      user: data.user,
      ready: true,
    });
  }, []);

  const apiRef = useRef<ApiClient | null>(null);
  if (!apiRef.current) {
    apiRef.current = createApiClient({
      getToken: () => stateRef.current.token,
      onUnauthorized: clearAuth,
    });
  }

  const value: AuthContextValue = {
    ...state,
    setAuth,
    clearAuth,
    api: apiRef.current,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
