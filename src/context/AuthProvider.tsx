/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ReactNode } from "react";
import type { UserResponseDto } from "../types";
import { post } from "../lib/api";
import { AuthContext } from "./authContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<UserResponseDto | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email: string, password: string) {
    try {
      const res = await post<{ token: string }>("/auth/login", {
        email,
        password,
      });

      if (!res?.token) throw new Error("Invalid login response");

      localStorage.setItem("access_token", res.token);

      const userRes = await fetch("/user/me", {
        headers: { Authorization: `Bearer ${res.token}` },
      });
      if (!userRes.ok) throw new Error("Failed to fetch user info");
      const userData = (await userRes.json()) as UserResponseDto;

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Login failed:", err.message || err);
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
