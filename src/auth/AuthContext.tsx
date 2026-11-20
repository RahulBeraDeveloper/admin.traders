import { createContext, useContext, useState, type ReactNode } from "react";

const SESSION_KEY = "aich_admin_session";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  // Credentials come from .env (VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD).
  // Replace this function with an API call when the backend is ready.
  const login = (email: string, password: string): boolean => {
    const okEmail = email.trim().toLowerCase() === (import.meta.env.VITE_ADMIN_EMAIL ?? "").trim().toLowerCase();
    const okPassword = password === import.meta.env.VITE_ADMIN_PASSWORD;
    if (okEmail && okPassword && import.meta.env.VITE_ADMIN_EMAIL) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
