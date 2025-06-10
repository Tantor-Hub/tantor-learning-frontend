// File: src/lib/api/base-api.ts
import { RootState } from "@/store/store";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { tokenStorage } from "@/features/token-storage";

// Base query with authentication
export const baseQuery = fetchBaseQuery({
  baseUrl: "https://tantor-learning.up.railway.app",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");

    // Get token from state with proper type handling
    const state = getState() as RootState;
    const token = state.auth?.token;

    if (token) {
      headers.set("x-connexion-tantor", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Check if we should refresh the token before making the request
  if (tokenStorage.shouldRefreshToken() && !tokenStorage.isRefreshTokenExpired()) {
    const tokens = tokenStorage.get();
    if (tokens?.refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: "/users/user/refresh",
            method: "PUT",
            body: { refresh_token: tokens.refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newTokens = refreshResult.data as {
            token: string;
            refreshToken?: string;
          };

          // Update tokens in storage
          tokenStorage.save({
            accessToken: newTokens.token,
            refreshToken: newTokens.refreshToken || tokens.refreshToken,
          });
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired, try to refresh
    const tokens = tokenStorage.get();

    if (tokens?.refreshToken && !tokenStorage.isRefreshTokenExpired()) {
      try {
        const refreshResult = await baseQuery(
          {
            url: "auth/refresh",
            method: "POST",
            body: { refreshToken: tokens.refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newTokens = refreshResult.data as {
            token: string;
            refreshToken?: string;
          };

          // Update tokens
          tokenStorage.save({
            accessToken: newTokens.token,
            refreshToken: newTokens.refreshToken || tokens.refreshToken,
          });

          // Retry the original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout user
          tokenStorage.clear();
          window.location.href = "/signin";
        }
      } catch (error) {
        // Refresh failed, logout user
        tokenStorage.clear();
        window.location.href = "/signin";
      }
    } else {
      // No valid refresh token, logout user
      tokenStorage.clear();
      window.location.href = "/signin";
    }
  }

  return result;
};

// Define common tag types for cache invalidation
export const commonTagTypes = [
  "Auth",
  "User",
  "Formation",
  "Category",
  "Admin",
  "Event",
  "Message",
];

// Re-export for convenience
export { createApi };

// Export the enhanced base query for use in API slices
export { baseQueryWithReauth as enhancedBaseQuery };
