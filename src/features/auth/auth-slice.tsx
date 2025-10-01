import { authApi } from "@/lib/apis/auth-api";
import { usersApi } from "@/lib/apis/users-api";
import { IUser, UserRole } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

// Helper to persist auth state to localStorage - now using stringified dates and consistent property names
const persistAuthState = (state: AuthState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "authState",
      JSON.stringify({
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      })
    );
  }
};

// Helper to load auth state from localStorage
const loadAuthState = (): Partial<AuthState> => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("authState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        return {
          token: parsedState.token,
          refreshToken: parsedState.refreshToken,
          expiresAt: parsedState.expiresAt,
          isAuthenticated: parsedState.token && parsedState.refreshToken ? true : false,
          user: parsedState.user,
        };
      } catch (e) {
        console.error("Failed to parse auth state from localStorage", e);
      }
    }
  }
  return {};
};

// Get initial state with merged localStorage data if available
const getInitialState = (): AuthState => {
  const persistedState = loadAuthState();
  return { ...initialState, ...persistedState };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
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

      persistAuthState(state);
    },
    clearCredentials: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
      }
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = { ...state.user, ...action.payload };
      persistAuthState(state);
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Handle token refresh attempt
    refreshTokenStart: (state) => {
      state.isLoading = true;
    },
    refreshTokenSuccess: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string; expiresIn: number }>
    ) => {
      const { token, refreshToken, expiresIn } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.expiresAt = Date.now() + expiresIn * 1000;
      state.isLoading = false;
      state.error = null;

      persistAuthState(state);
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Add session initialization reducer
    initializeSession: (state, action: PayloadAction<Partial<AuthState>>) => {
      const { token, refreshToken, expiresAt, isAuthenticated, user } = action.payload;

      if (token) state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;
      if (expiresAt) state.expiresAt = expiresAt;
      if (isAuthenticated !== undefined) state.isAuthenticated = isAuthenticated;
      if (user) state.user = user;

      // Persist the initialized session
      persistAuthState(state);
    },
  },
  // Handle auth API responses automatically
  extraReducers: (builder) => {
    builder
      // Auth API matchers
      .addMatcher(authApi.endpoints.loginPasswordLess.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.loginPasswordLess.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.loginPasswordLess.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || "Passwordless login failed";
      })

      .addMatcher(authApi.endpoints.registerPasswordLess.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.registerPasswordLess.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.registerPasswordLess.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || "Passwordless register failed";
      })

      .addMatcher(authApi.endpoints.verifyPasswordLess.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.verifyPasswordLess.matchFulfilled, (state, { payload }) => {
        state.token = payload.data.auth_token;
        state.refreshToken = payload.data.refresh_token;
        state.expiresAt = Date.now() + 3600 * 1000; // Default 1 hour, since expires_in not in response
        state.isAuthenticated = true;
        state.isLoading = false;

        // Set user from payload.data.user
        if (payload.data.user) {
          state.user = payload.data.user;
        }

        persistAuthState(state);
      })
      .addMatcher(authApi.endpoints.verifyPasswordLess.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || "Passwordless verify failed";
      })

      .addMatcher(authApi.endpoints.verify.matchFulfilled, (state, { payload }) => {
        if (payload.auth_token) {
          state.token = payload.auth_token;
          state.refreshToken = payload.refresh_token;
          state.expiresAt = Date.now() + payload.expires_in * 1000;
          state.isAuthenticated = true;

          persistAuthState(state);
        }
      })

      .addMatcher(authApi.endpoints.refreshToken.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, { payload }) => {
        state.token = payload.auth_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
        state.isLoading = false;

        persistAuthState(state);
      })
      .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || "Token refresh failed";
        // Don't clear credentials here - that decision should be made at a higher level
      })

      .addMatcher(authApi.endpoints.authWithGoogle.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.authWithGoogle.matchFulfilled, (state, { payload }) => {
        state.token = payload.auth_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
        state.isAuthenticated = true;
        state.isLoading = false;

        persistAuthState(state);
      })
      .addMatcher(authApi.endpoints.authWithGoogle.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || "Google auth failed";
      })

      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;

        if (typeof window !== "undefined") {
          localStorage.removeItem("authState");
        }
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if the logout API fails, we should clear local state
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;

        if (typeof window !== "undefined") {
          localStorage.removeItem("authState");
        }
      })

      // User API matchers (for profile updates)
      .addMatcher(usersApi.endpoints.updateUserProfile.matchFulfilled, (state, { payload }) => {
        if (payload && state.user) {
          state.user = {
            ...state.user,
            firstName: payload.firstName || state.user.firstName,
            lastName: payload.lastName || state.user.lastName,
            email: payload.email || state.user.email,
            avatar: state.user.avatar,
            address: payload.adresse_physique || state.user.address,
            country: payload.pays_residance || state.user.country,
            city: payload.ville_residance || state.user.city,
            identityNumber: payload.num_piece_identite
              ? parseInt(payload.num_piece_identite)
              : state.user.identityNumber,
            createdAt: new Date(payload.createdAt),
            role:
              payload.roles && payload.roles.length > 0
                ? (payload.roles[0].role as UserRole)
                : state.user.role,
          };
          persistAuthState(state);
        }
      });
  },
});

export const {
  setCredentials,
  clearCredentials,
  updateUser,
  setAuthLoading,
  setAuthError,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  initializeSession,
} = authSlice.actions;

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
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectCurrentUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

export default authSlice.reducer;
