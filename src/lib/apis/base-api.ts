import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { tokenStorage } from "@/features/token-storage";
import { getValidAuthTokens } from "@/lib/cookies";

// Base query with authentication
export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  // credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");

    // Get token from cookies
    const { token } = getValidAuthTokens();
    console.log("Using token from cookies in baseQuery:", token);
    // if (token) {
    headers.set(
      "x-connexion-tantor",
      `Bearer VmpKNGIyTXhUWGxTYTJoVVlUSm9ZVlJYTVRSVlZteFhWbTVrVkdKR2NGcFpNRlozVkd4YVZWWnVaRlpOVjJoUVZUSXhTMk14VGxWU2JIQk9VbFJXVEZaSE1UQmpNazUwVkd0a2FGSnRVbE5VVldNMFRWWlNTRTFXWkU5V2F6VXhWVmN4UjFVeVJuUmtSRkpZVjBoQ1RGWnFTbGRXYlVwSlVtMXNUbUpZYUZCWGJHUTBXVmRPYzFWc2FFNVdWbkJQVm14U1IwMUdXbGRoUms1WVlrWnNNMWt3YUVkWFIwcEdUVlJPVlZaV2NETlpNVnAzVG14V2NrMVdaRk5OYkVWM1ZtdGplR1F4Vm5SVmEyUnFVbGRvVjFaclZURlVNV3hZWkVkR2FtSkhVbHBaTUZwUFlVWmFWVkpyV2xwV1YxSjZWVEl4UjFkV2NFbFJiVVpUWWxkb1dWZFVRbUZrTVVsM1QxWldVMkpZUWs5WmExcDJUVlpWZUZwSVpHdGlWVnBYVkZaU1lWWXlTbGxWYXpsYVlrWmFWMXBWV2xOWFJURlhVMjEwVTJKWWFGcFdWRWw0WkRGc1YxWnFXbEpYUjFKWldXeG9RMlJXVW5KV2FsSlhWbTA1TmxsVlZUVmhSMHBHVjFoa1YwMXVVbkpXVjNOM1pEQXhXVkpzVG1sWFJrcG9WMnhrTkZNeVRrZFZiRnBXWWxSc2IxWnNaRFJrTVhCRlUyNU9hRlpyYkRSV01XaHpWMGRLU0ZWVVFsaGlWRVpJVmpCVk1WZEhVa2hoUm1ST1VrWmFNbFl5ZEZkaGF6VllWbXhhYVZORlduQmFWM2hoVkRGV1ZWUnRkR3BTYlhoWVYydFdhMVJzU2xobFNHaGFZV3MxZGxaRVNsZGpNa3BGVld4V2FXSnJTbFJYYkdSNlRWWmFWMk5FV2xKaGVrWlRWRlZvUTJWc1pITldiVGxTWWxWYVYxUXhhRWRWTVZwR1RsWkNXbFl6VWxkVVZWcFRWMGRPU1ZOck9WZFdSM2hIVm14a2QyTnRVbGRYYTJoclVqTlNjbFJWYUVOaVZsRjNWVzVPYWxZeFdubFdNVkpUVjBaS1ZXSklXbFpOUm5CVVdYcEdVMDVWTVZsUmJHUk9UV3hLVDFaWE1UQlNNVkpYVjI1V1ZXRXdjSE5aYkZKelpFWmtWMWt6YUU1TmJGcDZWVmMxYjFVeFdsZGpTRVpZWW0xTk5WVkdSVGxRVVQwOQ==","refresh_token":"VmpKNGIyTXhUWGxTYTJoVVlUSm9ZVlJYTVRSVlZteFhWbTVrVkdKR2NGcFpNRlozVkd4YVZWWnVaRlpOVjJoUVZUSXhTMk14VGxWU2JIQk9VbFJXVEZaSE1UQmpNazUwVkd0a2FGSnRVbE5VVldNMFRWWlNTRTFXWkU5V2F6VXhWVmN4UjFVeVJuUmtSRkpZVjBoQ1RGWnFTbGRXYlVwSlVtMXNUbUpZYUZCWGJHUTBXVmRPYzFWc2FFNVdWbkJQVm14U1IwMUdXbGRoUms1WVlrWnNNMWt3YUVkWFIwcEdUVlJPVlZaV2NETlpNVnAzVG14V2NrMVdaRk5OYkVWM1ZtdGplR1F4Vm5SVmEyUnFVbGRvVjFaclZURlVNV3hZWkVkR2FtSkhVbHBaTUZwUFlVWmFWVkpyV2xwV1YxSjZWVEl4UjFkV2NFbFJiVVpUWWxkb1dWZFVRbUZrTVVsM1QxWldVMkpZUWs5WmExcDJUVlpWZUZwSVpHdGlWVnBYVkZaU1lWWXlTbGxWYXpsYVlrWmFWMXBWV2xOWFJURlhVMjEwVTJKWWFGcFdWRWw0WkRGc1YxWnFXbEpYUjFKWldXeG9RMlJXVW5KV2FsSlhWbTA1TmxsVlZUVmhSMHBHVjFoa1YwMXVVbkpXVjNOM1pEQXhXVkpzVG1sWFJrcG9WMnhrTkZNeVRrZFZiRnBXWWxSc2IxWnNaRFJrTVhCRlUyNU9hRlpyYkRSV01XaHpWMGRLU0ZWVVFsaGlWRVpJVmpCVk1WZEhVa2hoUm1ST1VrWmFNbFl5ZEZkaGF6VllWbXhhYVZORlduQmFWM2hoVkRGV1ZWUnRkR3BTYlhoWVYydFdhMVJzU2xobFNHaGFZV3MxZGxaRVNsZGpNa3BGVld4V2FXSnJTbFJYYkdSNlRWWmFWMk5FV2xKaGVrWlRWRlZvUTJWc1pITldiVGxTWWxWYVYxUXhhRWRWTVZwR1RsWkNXbFl6VW5wVVZFWlRWbXhXY21ORk5VNVNSM2hIVm14a2QyTnRVbGhVYTFwVllYcFdWMWxyWkZOTlZtUllZMGRHYWxJd2NERlhhazV6VlRKR05scDZSbGhXTTBKVVZHdGFVMUp0U2taVWJGSnBWMFUwZDFadGRHRlNNbFpYVTJ4b1UySnJXazlXTUZwTFYyeGFjVkZ0ZEZKTmF6VlhWREJTVTFaV1RraGhSbHBYVFZWVk5WVkdSVGxRVVQwOQ==`
    );
    // }
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
            url: "users/auth/refresh",
            method: "POST",
            body: { refreshToken: tokens.refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newTokens = refreshResult.data as {
            auth_token: string;
            refresh_token?: string;
          };

          // Update tokens in storage
          tokenStorage.save({
            accessToken: newTokens.auth_token,
            refreshToken: newTokens.refresh_token || tokens.refreshToken,
          });

          // Update Redux state as well
          api.dispatch({
            type: "auth/refreshTokenSuccess",
            payload: {
              token: newTokens.auth_token,
              refreshToken: newTokens.refresh_token || tokens.refreshToken,
              expiresIn: 3600, // Default 1 hour
            },
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
            url: "users/auth/refresh",
            method: "POST",
            body: { refreshToken: tokens.refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newTokens = refreshResult.data as {
            auth_token: string;
            refresh_token?: string;
          };

          // Update tokens
          tokenStorage.save({
            accessToken: newTokens.auth_token,
            refreshToken: newTokens.refresh_token || tokens.refreshToken,
          });

          // Update Redux state
          api.dispatch({
            type: "auth/refreshTokenSuccess",
            payload: {
              token: newTokens.auth_token,
              refreshToken: newTokens.refresh_token || tokens.refreshToken,
              expiresIn: 3600, // Default 1 hour
            },
          });

          // Retry the original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout user
          api.dispatch({ type: "auth/clearCredentials" });
          tokenStorage.clear();
          window.location.href = "/signin";
        }
      } catch (error) {
        // Refresh failed, logout user
        api.dispatch({ type: "auth/clearCredentials" });
        tokenStorage.clear();
        window.location.href = "/signin";
      }
    } else {
      // No valid refresh token, logout user
      api.dispatch({ type: "auth/clearCredentials" });
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
  "Document",
  "LessonDocument",
  "StudentEvaluations",
  "UserInSession",
];

// Re-export for convenience
export { createApi };

// Export the enhanced base query for use in API slices
export { baseQueryWithReauth as enhancedBaseQuery };
