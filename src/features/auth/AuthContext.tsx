import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchCurrentUser } from "../../api/authApi";
import type { User } from "../../types/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setSession: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lúc load lại trang: nếu đã có token trong localStorage, gọi /api/users/me để
  // xác nhận token còn hợp lệ và lấy lại thông tin user — quan trọng để test OAuth
  // vì sau khi Google redirect về, trang sẽ reload và mất state React trong bộ nhớ.
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .finally(() => setIsLoading(false));
  }, []);

  function setSession(accessToken: string, refreshToken: string, user: User) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong AuthProvider");
  return ctx;
}
