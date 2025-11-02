"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "react-hot-toast";

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const router = useRouter();
  const isAuthenticated = useAuth(); // Use the improved useAuth hook for server-side validation

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
