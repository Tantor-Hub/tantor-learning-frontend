import { IUser } from "@/types/user";
import { baseQuery, createApi, enhancedBaseQuery } from "./base-api";

// Types for better type safety
export interface AuthCredentials {
  user_name: string;
  password: string;
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
    // user: SignupData;
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
    loginPasswordLess: builder.mutation<
      {
        statusCode: number;
        status?: string;
        message: string;
      },
      { email: string }
    >({
      query: (request) => ({
        url: "users/user/passwordless/login",
        method: "POST",
        body: { email: request.email },
      }),
      // Invalidate auth cache on successful login
      invalidatesTags: ["Auth"],
    }),
    registerPasswordLess: builder.mutation<
      {
        statusCode: number;
        status?: string;
        message: string;
      },
      { firstName?: string; lastName?: string; email: string }
    >({
      query: (request) => ({
        url: "users/user/passwordless/register",
        method: "POST",
        body: request,
      }),
      // Invalidate auth cache on successful login
      invalidatesTags: ["Auth"],
    }),
    verifyPasswordLess: builder.mutation<
      {
        statusCode: number;
        status?: string;
        message: string;
        data: {
          auth_token: string;
          refresh_token: string;
          user: IUser;
        };
      },
      {
        email: string;
        otp: string;
      }
    >({
      query: (request) => ({
        url: "users/user/passwordless/verify",
        method: "POST",
        body: request,
      }),
      // Invalidate auth cache on successful login
      invalidatesTags: ["Auth"],
    }),
    signin: builder.mutation<TokenResponse, AuthCredentials>({
      query: (credentials) => ({
        url: "users/user/signin",
        method: "POST",
        body: credentials,
      }),
      // Invalidate auth cache on successful login
      invalidatesTags: ["Auth"],
    }),
    // signup: builder.mutation<TokenResponse, SignupData>({
    //   query: (data) => ({
    //     url: "users/user/signup",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
    verify: builder.mutation<TokenResponse, VerifyRequest>({
      query: (data) => ({
        url: "users/user/verify",
        method: "PUT",
        body: data,
      }),
    }),
    refreshToken: builder.mutation<TokenResponse, RefreshRequest>({
      query: (data) => ({
        url: "users/auth/refresh",
        method: "POST",
        body: { refreshToken: data.refresh_token },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "users/user/logout",
        method: "POST",
      }),
      // Invalidate auth cache on logout
      invalidatesTags: ["Auth"],
    }),
    resendCode: builder.mutation<void, ResendCodeRequest>({
      query: (request) => ({
        url: "/users/user/resendcode",
        method: "PUT",
        body: request,
      }),
    }),
    verifyBeforeResetPassword: builder.mutation<
      VerifyBeforeResetPasswordResponse,
      VerifyBeforeResetPasswordRequest
    >({
      query: (data) => ({
        url: "users/user/verify-before-reset-password",
        method: "PUT",
        body: data,
      }),
    }),
    authWithGoogle: builder.mutation<TokenResponse, void>({
      query: () => ({
        url: "users/user/authwithgoogle",
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: "users/user/forgotenpassword",
        method: "PUT",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: "users/user/resetpassword",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useSigninMutation,
  // useSignupMutation,
  useVerifyMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useResendCodeMutation,
  useAuthWithGoogleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyBeforeResetPasswordMutation,
  useLoginPasswordLessMutation,
  useRegisterPasswordLessMutation,
  useVerifyPasswordLessMutation,
} = authApi;
