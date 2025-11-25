"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getValidAuthTokens } from "@/lib/cookies";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  children?: React.ReactNode;
};

export const AuthWrapper = ({ children }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { token } = getValidAuthTokens();
  useEffect(() => {
    // Simulate auth check delay for better UX
    const timer = setTimeout(() => {
      if (!token) {
        // Use pathname + search instead of full URL to avoid encoding issues
        const redirectPath = window.location.pathname + (window.location.search || "");
        router.push(`/signin?redirect=${encodeURIComponent(redirectPath)}`);
        dispatch({ type: "auth/clearCredentials" });
      }
      setCheckingAuth(false);
    });

    return () => clearTimeout(timer);
  }, [token, router, dispatch]);

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">
          <Loader2 className="animate-spin text-primary size-16" />
        </div>
      </div>
    );
  }

  // Don't render children if no token (will redirect)
  if (!token) {
    return null;
  }

  return <>{children}</>;
};
