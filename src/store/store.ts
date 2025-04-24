import { configureStore, combineReducers, Reducer } from "@reduxjs/toolkit";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer, {
  clearCredentials,
  selectIsTokenExpired,
  selectRefreshToken,
  selectIsAuthenticated,
} from "../features/auth/auth-slice";
import { authApi } from "@/lib/api";
import storage from "redux-persist/lib/storage";

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

// Initial reducer setup without persistence
const initialReducers = {
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
};

// Function to create the store
function createAppStore() {
  // Create basic store without persistence first
  const baseStore = configureStore({
    reducer: initialReducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        .prepend(listenerMiddleware.middleware)
        .concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  // Only setup persistence on client side
  if (typeof window !== "undefined") {
    const persistConfig = {
      key: "auth",
      storage,
      whitelist: ["token", "refreshToken", "expiresAt"],
    };

    const persistedReducer = persistReducer(persistConfig, authReducer);

    // Replace the auth reducer with the persisted one
    const rootReducer = combineReducers({
      ...initialReducers,
      auth: persistedReducer,
    });

    // Use a more aggressive type assertion through unknown
    baseStore.replaceReducer(
      rootReducer as unknown as Reducer<ReturnType<typeof baseStore.getState>>
    );

    const persistor = persistStore(baseStore);
    return { store: baseStore, persistor };
  }

  return { store: baseStore, persistor: null };
}

// Create the store
const { store, persistor } = createAppStore();

export { persistor };
export default store;

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
