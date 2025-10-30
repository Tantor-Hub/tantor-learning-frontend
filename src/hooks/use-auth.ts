import { clearCredentials } from "@/features/auth/auth-slice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";
import { getAuthState } from "@/lib/cookies";

function useAuth() {
  const dispatch = useDispatch();
  const reduxIsAuthenticated = useSelector(selectIsAuthenticated);
  const [isAuthenticated, setIsAuthenticated] = useState(reduxIsAuthenticated);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Get auth state from cookies
        const authState = getAuthState();
        const token = authState.token;
        const isAuthFromCookie = authState.isAuthenticated;
        const expiresAt = authState.expiresAt;

        // Check if token exists and is not expired
        const isTokenValid = token && expiresAt && Date.now() < expiresAt;

        if (!isTokenValid || !isAuthFromCookie) {
          setIsAuthenticated(false);
          if (reduxIsAuthenticated) {
            dispatch(clearCredentials());
          }
          return;
        }

        setIsAuthenticated(true);

        // If Redux state doesn't match cookie state, update Redux
        if (!reduxIsAuthenticated && isTokenValid && isAuthFromCookie) {
          // The store initialization will handle this
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        if (reduxIsAuthenticated) {
          dispatch(clearCredentials());
        }
      }
    };

    checkAuthStatus();
  }, [reduxIsAuthenticated, dispatch]);

  return isAuthenticated;
}

export { useAuth };
