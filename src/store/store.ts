import { configureStore, combineReducers, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import authReducer, {
  clearCredentials,
  selectIsTokenExpired,
  selectRefreshToken,
  selectIsAuthenticated,
  setCredentials,
} from "../features/auth/auth-slice";
import { authApi } from "@/lib/api";

// Create listener middleware for token refresh
const listenerMiddleware = createListenerMiddleware();

// Set up the listener logic
listenerMiddleware.startListening({
  predicate: (action, currentState) => {
    // Skip auth-related endpoints and non-authenticated states
    if (
      action.type.includes("authApi") ||
      action.type.includes("forgotPassword") ||
      action.type.includes("resetPassword") ||
      !selectIsAuthenticated(currentState as any)
    ) {
      return false;
    }

    // Check if action is an API call and if token is expired
    const isApiCall =
      action.type.endsWith("/executeQuery") || action.type.endsWith("/executeMutation");
    return isApiCall && selectIsTokenExpired(currentState as any);
  },
  effect: async (action, { dispatch, getState }) => {
    const refreshToken = selectRefreshToken(getState() as any);

    if (!refreshToken) {
      // No refresh token available, log user out
      dispatch(clearCredentials());
      return;
    }

    try {
      // Attempt to refresh the token
      await dispatch(
        authApi.endpoints.refreshToken.initiate({ refresh_token: refreshToken })
      ).unwrap();

      // Re-dispatch the original action to retry with new token
      dispatch(action);
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Refresh failed, log user out
      dispatch(clearCredentials());
    }
  },
});

// Simple localStorage middleware for auth state persistence with proper TypeScript types
const localStorageMiddleware: Middleware = (store: MiddlewareAPI) => (next) => (action) => {
  const result = next(action);

  // Save auth state to localStorage when it changes
  if (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string" &&
    (action.type.startsWith("auth/") || action.type.includes("authApi/executeMutation"))
  ) {
    const state = store.getState();
    const authState = state.auth;

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "authState",
        JSON.stringify({
          token: authState.token,
          refreshToken: authState.refreshToken,
          expiresAt: authState.expiresAt,
          isAuthenticated: authState.isAuthenticated,
          user: authState.user,
        })
      );
    }
  }

  return result;
};

// Create the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(authApi.middleware, localStorageMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Load auth state from localStorage on app initialization
if (typeof window !== "undefined") {
  const savedAuthState = localStorage.getItem("authState");
  if (savedAuthState) {
    try {
      const parsedState = JSON.parse(savedAuthState);
      // Only restore if the token is still valid
      if (parsedState.expiresAt && parsedState.expiresAt > Date.now()) {
        store.dispatch(
          setCredentials({
            token: parsedState.token,
            refreshToken: parsedState.refreshToken,
            expiresIn: (parsedState.expiresAt - Date.now()) / 1000,
            user: parsedState.user,
          })
        );
      } else {
        // Clear expired state
        localStorage.removeItem("authState");
      }
    } catch (e) {
      console.error("Failed to parse auth state from localStorage", e);
      localStorage.removeItem("authState");
    }
  }
}

export default store;

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
