import { clearCredentials } from "@/features/auth/auth-slice";
import { useState, useEffect } from "react";

function useAuth() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get token inside useEffect to ensure it's fresh
        const token = localStorage.getItem("authState.token");

        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await fetch(`${baseURL}/users/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-connexion-tantor": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // Return true only if status is 200 and token is valid
        // Return false for 401 (expired token) or any other error
        setIsAuthenticated(data.status === 200 && data.data?.isTokenValid === true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        clearCredentials();
      }
    };

    if (baseURL) {
      checkAuthStatus();
    }
  }, [baseURL]);

  return isAuthenticated; // Returns only boolean
}

export { useAuth };
