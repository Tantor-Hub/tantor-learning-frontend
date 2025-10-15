import { getCookie, setCookie, deleteCookie } from "cookies-next";

// helpers to get cookies
const getAuthCookie = (name: string) => {
  const cookie = getCookie(name);

  if (!cookie) return undefined;

  return Buffer.from(cookie as string, "base64").toString("ascii");
};

export const getValidAuthTokens = () => {
  const token = getAuthCookie("auth_token");
  const refreshToken = getAuthCookie("refresh_token");

  if (!token) return { token: undefined, refreshToken: undefined };

  // For simplicity, we'll assume tokens are valid if they exist
  // In a real app, you might want to check expiration
  return {
    token,
    refreshToken,
  };
};

export const setAuthCookie = (token: string, name: string) => {
  const toBase64 = Buffer.from(token).toString("base64");

  setCookie(name, toBase64, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
    // more security options here
    // sameSite: 'strict',
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  });
};

export const setRefreshTokenCookie = (refreshToken: string) => {
  const toBase64 = Buffer.from(refreshToken).toString("base64");

  setCookie("refresh_token", toBase64, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
    // more security options here
    // sameSite: 'strict',
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  });
};

export const getRefreshToken = () => {
  return getAuthCookie("refresh_token");
};

export const removeAuthCookie = (name: string) => {
  deleteCookie(name);
};

export const removeRefreshTokenCookie = () => {
  deleteCookie("refresh_token");
};

// Flat cookie storage for auth state
export const setAuthStateCookie = (key: string, value: string) => {
  const toBase64 = Buffer.from(value).toString("base64");

  setCookie(`auth_${key}`, toBase64, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
};

export const getAuthStateCookie = (key: string) => {
  return getAuthCookie(`auth_${key}`);
};

export const removeAuthStateCookie = (key: string) => {
  deleteCookie(`auth_${key}`);
};

export const clearAllAuthCookies = () => {
  // Remove token cookies
  removeAuthCookie("auth_token");
  removeRefreshTokenCookie();

  // Remove auth state cookies
  removeAuthStateCookie("token");
  removeAuthStateCookie("refreshToken");
  removeAuthStateCookie("expiresAt");
  removeAuthStateCookie("isAuthenticated");
  removeAuthStateCookie("user");
};
