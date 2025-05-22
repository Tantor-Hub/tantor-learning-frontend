import { baseQuery, createApi } from "./base-api";

// Types for better type safety
export interface AuthCredentials {
  user_name: string;
  password: string;
}

type Role = {
  role: string;
};

export interface SignupData {
  fs_name: string;
  ls_name: string;
  password: string;
  nick_name: string;
  email: string;
  roles?: Role[];
}

export interface TokenResponse {
  auth_token: string;
  refresh_token: string;
  expires_in: number;
  status: number;
  message: string;
  data: {
    refresh_token: string;
    auth_token: string;
    message: string;
    user: SignupData;
  };
}

export interface VerifyRequest {
  email_user: string;
  verication_code: number;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface ResendCodeRequest {
  user_email: string;
}

export interface ForgotPasswordRequest {
  user_email: string;
}

export interface ResetPasswordRequest {
  user_name: string;
  verification_code: string;
  new_password: string;
  repet_new_password: string;
}

// verifyBeforeResetPassword

interface VerifyBeforeResetPasswordRequest {
  email_user: string;
  verication_code: number;
}

interface VerifyBeforeResetPasswordResponse {
  status: number;
  message: string;
  data: string; //  "Le code de vérification est invalide";
}

// Auth API slice with improved token handling
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
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
    verify: builder.mutation<TokenResponse, VerifyRequest>({
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
    resendCode: builder.mutation<void, ResendCodeRequest>({
      query: (data) => ({
        url: "/api/users/user/resendcode",
        method: "PUT",
        body: data,
      }),
    }),
    verifyBeforeResetPassword: builder.mutation<
      VerifyBeforeResetPasswordResponse,
      VerifyBeforeResetPasswordRequest
    >({
      query: (data) => ({
        url: "/api/users/user/verify-before-reset-password",
        method: "PUT",
        body: data,
      }),
    }),
    authWithGoogle: builder.mutation<TokenResponse, void>({
      query: () => ({
        url: "/api/users/user/authwithgoogle",
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/api/users/user/forgotenpassword",
        method: "PUT",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: "/api/users/user/resetpassword",
        method: "PUT",
        body: data,
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyBeforeResetPasswordMutation,
} = authApi;
