import { authApi } from "@/lib/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  user: null | {
    id: string;
    username: string;
    email: string;
  };
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        expiresIn: number;
        user?: any;
      }>
    ) => {
      const { token, refreshToken, expiresIn, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.expiresAt = Date.now() + expiresIn * 1000;
      state.isAuthenticated = true;
      if (user) state.user = user;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.user = null;

      // Also clear localStorage when logging out
      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
      }
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
  // Handle auth API responses automatically
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.signin.matchFulfilled, (state, { payload }) => {
        state.token = payload.access_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, { payload }) => {
        state.token = payload.access_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, { payload }) => {
        state.token = payload.access_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
      })
      .addMatcher(authApi.endpoints.authWithGoogle.matchFulfilled, (state, { payload }) => {
        state.token = payload.access_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
        state.isAuthenticated = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.isAuthenticated = false;
        state.user = null;

        // Also clear localStorage when logging out
        if (typeof window !== "undefined") {
          localStorage.removeItem("authState");
        }
      });
  },
});

export const { setCredentials, clearCredentials, updateUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectTokenExpiration = (state: { auth: AuthState }) => state.auth.expiresAt;
export const selectIsTokenExpired = (state: { auth: AuthState }) => {
  const expiresAt = state.auth.expiresAt;
  if (!expiresAt) return true;
  // Consider token expired 30 seconds before actual expiration to avoid edge cases
  return Date.now() > expiresAt - 30000;
};

export default authSlice.reducer;
