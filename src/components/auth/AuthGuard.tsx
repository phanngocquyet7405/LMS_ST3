"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthService from "@/src/app/service/AuthService";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      const isAuth = AuthService.isAuthenticated();
      console.log("[v0] AuthGuard - isAuthenticated:", isAuth);

      if (!isAuth) {
        router.push("/auth/login");
        return;
      }

      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#424754] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
