import { authApi, SignupData } from "@/lib/apis/auth-api";
import { usersApi } from "@/lib/apis/users-api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  user: null | {
    id: string;
    username: string;
    email: string;
    fs_name?: string;
    ls_name?: string;
    nick_name?: string;
    // Added additional user properties
    phone?: string;
    avatar?: string;
    roles: {
      id: number;
      role: string;
      description: string;
      HasRoles: {
        id: number;
        UserId: number;
        RoleId: number;
        status: number;
        createdAt: string;
        updatedAt: string;
      };
    }[];
  };
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
      .addMatcher(authApi.endpoints.signin.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.signin.matchFulfilled, (state, { payload }) => {
        state.token = payload.auth_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
        state.isAuthenticated = true;
        state.isLoading = false;

        // If user data exists in the response
        if (payload.data?.user) {
          state.user = {
            id: "", // Will be populated later when getting user profile
            username: payload.data.user.nick_name || "",
            email: payload.data.user.email || "",
            fs_name: payload.data.user.fs_name,
            ls_name: payload.data.user.ls_name,
            nick_name: payload.data.user.nick_name,
            roles: payload.data.user.roles || [],
          };
        }

        persistAuthState(state);
      })
      .addMatcher(authApi.endpoints.signin.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || "Login failed";
      })

      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, { payload }) => {
        state.token = payload.auth_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
        state.isAuthenticated = true;
        state.isLoading = false;

        // If user data exists in the response
        if (payload.data?.user) {
          state.user = {
            id: "",
            username: payload.data.user.nick_name || "",
            email: payload.data.user.email || "",
            fs_name: payload.data.user.fs_name,
            ls_name: payload.data.user.ls_name,
            nick_name: payload.data.user.nick_name,
            roles: payload.data.user.roles || [],
          };
        }

        persistAuthState(state);
      })
      .addMatcher(authApi.endpoints.signup.matchRejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message || "Signup failed";
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
            ...payload,
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

export default authSlice.reducer;
