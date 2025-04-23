import { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Types for better type safety
export interface AuthCredentials {
  user_name: string;
  password: string;
}
export interface SignupData {
  fs_name: string;
  ls_name: string;
  password: string;
  nick_name: string;
  email: string;
}
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
export interface VerifyRequest {
  user_email: string;
  verication_code: string;
}
export interface RefreshRequest {
  refresh_token: string;
}
export interface ResendCodeRequest {
  user_email: string;
}
// Auth API slice with improved token handling
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://tantor.buhendje.com",
    // Get token from Redux state instead of hardcoding
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      // Get token from state
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("x-connexion-tantor", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Tags for cache invalidation
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signin: builder.mutation<TokenResponse, AuthCredentials>({
      query: (credentials) => ({
        url: "/api/users/user/signin",
        method: "POST",
        body: credentials,
      }),
      // Invalidate auth cache on successful login
      invalidatesTags: ["Auth"],
    }),
    signup: builder.mutation<TokenResponse, SignupData>({
      query: (data) => ({
        url: "/api/users/user/signup",
        method: "POST",
        body: data,
      }),
    }),
    verify: builder.mutation<{ valid: boolean }, VerifyRequest>({
      query: (data) => ({
        url: "/api/users/user/verify",
        method: "PUT",
        body: data,
      }),
    }),
    refreshToken: builder.mutation<TokenResponse, RefreshRequest>({
      query: (data) => ({
        url: "/api/users/user/refresh",
        method: "PUT",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/users/user/logout",
        method: "POST",
      }),
      // Invalidate auth cache on logout
      invalidatesTags: ["Auth"],
    }),
    // First added endpoint - resend verification code
    resendCode: builder.mutation<void, ResendCodeRequest>({
      query: (data) => ({
        url: "/api/users/user/resendcode",
        method: "PUT",
        body: data,
      }),
    }),
    // Second added endpoint - authenticate with Google
    authWithGoogle: builder.mutation<TokenResponse, void>({
      query: () => ({
        url: "/api/users/user/authwithgoogle",
        method: "GET",
      }),
    }),
  }),
});
export const {
  useSigninMutation,
  useSignupMutation,
  useVerifyMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useResendCodeMutation,
  useAuthWithGoogleMutation,
} = authApi;
