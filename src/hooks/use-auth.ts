import { clearCredentials } from "@/features/auth/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";

function useAuth() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const reduxIsAuthenticated = useSelector(selectIsAuthenticated);
  const [isAuthenticated, setIsAuthenticated] = useState(reduxIsAuthenticated);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get token from Redux state first, fallback to localStorage
        const token = reduxIsAuthenticated ? localStorage.getItem("authState.token") : null;

        if (!token) {
          setIsAuthenticated(false);
          if (reduxIsAuthenticated) {
            dispatch(clearCredentials());
          }
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
        const isValid = data.status === 200 && data.data?.isTokenValid === true;
        setIsAuthenticated(isValid);

        // If server says token is invalid but Redux thinks user is authenticated, clear credentials
        if (!isValid && reduxIsAuthenticated) {
          dispatch(clearCredentials());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        if (reduxIsAuthenticated) {
          dispatch(clearCredentials());
        }
      }
    };

    if (baseURL) {
      checkAuthStatus();
    }
  }, [baseURL, reduxIsAuthenticated, dispatch]);

  return isAuthenticated; // Returns only boolean
}

export { useAuth };
