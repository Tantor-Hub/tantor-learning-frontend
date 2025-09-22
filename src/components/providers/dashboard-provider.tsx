"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";
import { toast } from "react-hot-toast";

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
      toast("Veuillez vous connecter ou créer un compte pour accéder à votre tableau de bord");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or return a loading component
  }

  return <>{children}</>;
}
