import { authApi } from "@/lib/apis/auth-api";
import { usersApi } from "@/lib/apis/users-api";
import { IUser, UserRole } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setAuthState, clearAllAuthCookies, getAuthState } from "@/lib/cookies";

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

// Helper to persist auth state to cookies and localStorage
const persistAuthState = (state: AuthState) => {
  if (typeof window !== "undefined") {
    // Store tokens and auth state in flat cookies
    if (state.token && state.refreshToken && state.expiresAt) {
      setAuthState({
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      });
    }

    // Store user data in localStorage
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }
};

// Helper to load initial state from cookies and localStorage
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    try {
      // Load auth state from cookies
      const authState = getAuthState();

      // Load user data from localStorage
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      return {
        ...initialState,
        token: authState.token,
        refreshToken: authState.refreshToken,
        expiresAt: authState.expiresAt,
        isAuthenticated: Boolean(authState.isAuthenticated) && !!authState.token,
        user,
      };
    } catch (e) {
      console.error("Failed to load auth state from storage", e);
      // Clear invalid state
      clearAllAuthCookies();
      localStorage.removeItem("user");
    }
  }
  return initialState;
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
        user?: IUser;
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

      // Clear all storage
      clearAllAuthCookies();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
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
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.verifyPasswordLess.matchFulfilled, (state, { payload }) => {
        state.token = payload.data.auth_token;
        state.refreshToken = payload.data.refresh_token;
        state.expiresAt = Date.now() + 3600 * 1000;
        state.isAuthenticated = true;
        state.isLoading = false;

        if (payload.data.user) {
          state.user = payload.data.user;
        }

        persistAuthState(state);
      })
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, { payload }) => {
        state.token = payload.auth_token;
        state.refreshToken = payload.refresh_token;
        state.expiresAt = Date.now() + payload.expires_in * 1000;
        state.isLoading = false;

        persistAuthState(state);
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;

        clearAllAuthCookies();
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Clear state even if API call fails
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;

        clearAllAuthCookies();
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
      })
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
  refreshTokenSuccess,
  refreshTokenFailure,
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
  return Date.now() > expiresAt - 30000;
};
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectCurrentUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

export default authSlice.reducer;
