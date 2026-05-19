"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthService, {
  LoginPayload,
  RegisterPayload,
} from "@/src/app/service/AuthService";
import { User } from "@/lib/index";

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      if (AuthService.isAuthenticated()) {
        const localUser = AuthService.getCurrentUser();
        if (localUser) setUser(localUser);

        try {
          const latestUser = await AuthService.getProfile();
          setUser(latestUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(latestUser));
          }
        } catch (error) {
          console.error("Lỗi đồng bộ profile:", error);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const data = await AuthService.login(payload);
      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Hàm xử lý Đăng ký
  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      await AuthService.register(payload);
      router.push("/login");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Lỗi logout:", error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (AuthService.isAuthenticated()) {
      const latestUser = await AuthService.getProfile();
      setUser(latestUser);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp bắt buộc phải được đặt trong AppProvider");
  }
  return context;
}
