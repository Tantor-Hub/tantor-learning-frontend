import { authApi } from "@/lib/apis/auth-api";
import { configureStore, combineReducers, Middleware } from "@reduxjs/toolkit";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import authReducer, {
  clearCredentials,
  selectIsTokenExpired,
  selectRefreshToken,
  selectIsAuthenticated,
  setCredentials,
} from "../features/auth/auth-slice";
import dashboardReducer from "@/features/dashboard/dashboard-slice";
import documentReducer from "@/features/document/document-slice";
import { getAuthState } from "@/lib/cookies";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Create listener middleware for token refresh
const listenerMiddleware = createListenerMiddleware();

// Set up the listener logic
listenerMiddleware.startListening({
  predicate: (action, currentState) => {
    if (
      action.type.includes("authApi") ||
      action.type.includes("forgotPassword") ||
      action.type.includes("resetPassword") ||
      !selectIsAuthenticated(currentState as any)
    ) {
      return false;
    }

    const isApiCall =
      action.type.endsWith("/executeQuery") || action.type.endsWith("/executeMutation");
    return isApiCall && selectIsTokenExpired(currentState as any);
  },
  effect: async (action, { dispatch, getState }) => {
    const refreshToken = selectRefreshToken(getState() as any);

    if (!refreshToken) {
      dispatch(clearCredentials());
      return;
    }

    if (isRefreshing) {
      try {
        await refreshPromise;
        dispatch(action);
      } catch {
        // If refresh failed, we've already logged out
      }
      return;
    }

    try {
      isRefreshing = true;
      refreshPromise = dispatch(
        authApi.endpoints.refreshToken.initiate({ refresh_token: refreshToken })
      ).unwrap();

      await refreshPromise;
      dispatch(action);
    } catch (error) {
      console.error("Token refresh failed:", error);
      dispatch(clearCredentials());
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  },
});

// Simple localStorage middleware for user data persistence
const userPersistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Save user data to localStorage when it changes
  if (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string" &&
    (action.type.startsWith("auth/") || action.type.includes("authApi/executeMutation"))
  ) {
    const state = store.getState();
    const user = state.auth.user;

    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }

  return result;
};

// Create the root reducer with all API reducers
const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  document: documentReducer,
  ...apiReducers,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(...apiMiddlewares, userPersistenceMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Load initial auth state from cookies and localStorage
if (typeof window !== "undefined") {
  const authState = getAuthState();
  const userStr = localStorage.getItem("user");

  if (authState.token && authState.refreshToken) {
    try {
      const user = userStr ? JSON.parse(userStr) : null;
      const expiresIn = authState.expiresAt ? (authState.expiresAt - Date.now()) / 1000 : 3600;

      store.dispatch(
        setCredentials({
          token: authState.token,
          refreshToken: authState.refreshToken,
          expiresIn,
          user,
        })
      );
    } catch (e) {
      console.error("Failed to parse auth state from storage", e);
      // Clear invalid state
      localStorage.removeItem("user");
    }
  }
}

export default store;

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// TypeScript hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { apiMiddlewares, apiReducers } from "@/lib/apis/api";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
