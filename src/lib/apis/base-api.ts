import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getValidAuthTokens } from "@/lib/cookies";

// Base query with authentication
export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");

    // Get token from cookies
    const { token } = getValidAuthTokens();
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
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired, try to refresh
    const { refreshToken } = getValidAuthTokens();

    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: "users/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newTokens = refreshResult.data as {
            auth_token: string;
            refresh_token?: string;
          };

          // Update Redux state which will update cookies
          api.dispatch({
            type: "auth/refreshTokenSuccess",
            payload: {
              token: newTokens.auth_token,
              refreshToken: newTokens.refresh_token || refreshToken,
              expiresIn: 3600,
            },
          });

          // Retry the original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout user
          api.dispatch({ type: "auth/clearCredentials" });
          window.location.href = "/signin";
        }
      } catch (error) {
        // Refresh failed, logout user
        api.dispatch({ type: "auth/clearCredentials" });
        window.location.href = "/signin";
      }
    } else {
      // No valid refresh token, logout user
      api.dispatch({ type: "auth/clearCredentials" });
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

// File upload base query without Content-Type header
export const fileUploadBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    // Get token from cookies
    const { token } = getValidAuthTokens();
    if (token) {
      headers.set("x-connexion-tantor", `Bearer ${token}`);
    }

    return headers;
  },
});

const fileUploadBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await fileUploadBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired, try to refresh
    const { refreshToken } = getValidAuthTokens();

    if (refreshToken) {
      try {
        const refreshResult = await fileUploadBaseQuery(
          {
            url: "users/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newTokens = refreshResult.data as {
            auth_token: string;
            refresh_token?: string;
          };

          // Update Redux state which will update cookies
          api.dispatch({
            type: "auth/refreshTokenSuccess",
            payload: {
              token: newTokens.auth_token,
              refreshToken: newTokens.refresh_token || refreshToken,
              expiresIn: 3600,
            },
          });

          // Retry the original request
          result = await fileUploadBaseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, logout user
          api.dispatch({ type: "auth/clearCredentials" });
          window.location.href = "/signin";
        }
      } catch (error) {
        // Refresh failed, logout user
        api.dispatch({ type: "auth/clearCredentials" });
        window.location.href = "/signin";
      }
    } else {
      // No valid refresh token, logout user
      api.dispatch({ type: "auth/clearCredentials" });
      window.location.href = "/signin";
    }
  }

  return result;
};

// Export the file upload enhanced base query
export { fileUploadBaseQueryWithReauth as fileUploadEnhancedBaseQuery };
