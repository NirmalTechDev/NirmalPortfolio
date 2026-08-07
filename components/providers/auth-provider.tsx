"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from "@/lib/auth-storage";
import { authService, LoginPayload } from "@/services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function initSession() {
      const session = await authService.getSession();
      if (session.authenticated && session.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
    initSession();
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.login(payload);
      setUser(res.user);
      router.push("/me");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push("/me/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
