"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "@/features/auth/auth-slice";
import { tokenStorage } from "@/features/token-storage";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Check tokens on app initialization
    const checkTokens = () => {
      const tokens = tokenStorage.get();

      if (!tokens) {
        return;
      }

      if (tokenStorage.isRefreshTokenExpired()) {
        // Refresh token expired, logout user
        dispatch(clearCredentials());
        tokenStorage.clear();
        router.push("/signin");
        return;
      }

      if (tokens.accessToken && tokens.refreshToken) {
        const now = Date.now();
        // Set credentials in Redux if tokens exist
        dispatch(
          setCredentials({
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: now + 22 * 60 * 60 * 1000,
          })
        );
      }
    };

    checkTokens();

    // Set up periodic token check (every 5 minutes)
    const interval = setInterval(
      () => {
        if (tokenStorage.isRefreshTokenExpired()) {
          dispatch(clearCredentials());
          tokenStorage.clear();
          router.push("/signin");
        }
      },
      5 * 60 * 1000
    ); // 5 minutes

    // Handle browser tab close/refresh - optional cleanup
    const handleBeforeUnload = () => {
      // You can add any cleanup logic here if needed
      // Note: logout API call won't complete on page unload
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch, router]);

  return <>{children}</>;
}

// export default withAuth(DashboardPage); usage
