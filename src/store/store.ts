import { configureStore } from "@reduxjs/toolkit";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import authReducer, {
  clearCredentials,
  selectIsTokenExpired,
  selectRefreshToken,
  selectIsAuthenticated,
} from "../features/auth/auth-slice";
import { authApi } from "@/lib/api";

// Create listener middleware for token refresh
const listenerMiddleware = createListenerMiddleware();

// Listen for API calls and check if token needs refreshing
listenerMiddleware.startListening({
  predicate: (action, currentState) => {
    // Skip auth-related endpoints and non-authenticated states
    if (action.type.includes("authApi") || !selectIsAuthenticated(currentState as RootState)) {
      return false;
    }

    // Check if action is an API call and if token is expired
    const isApiCall =
      action.type.endsWith("/executeQuery") || action.type.endsWith("/executeMutation");
    return isApiCall && selectIsTokenExpired(currentState as RootState);
  },
  effect: async (action, { dispatch, getState }) => {
    const refreshToken = selectRefreshToken(getState() as RootState);

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
      // Refresh failed, log user out
      dispatch(clearCredentials());
    }
  },
});

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(authApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Optional: Setup persisted state loading/saving for auth tokens if needed
// Could be added here using redux-persist or similar

export default store;

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
