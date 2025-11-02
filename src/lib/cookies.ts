import { getCookie, setCookie, deleteCookie } from "cookies-next";

// Helper to set flat cookies (no base64 encoding for simple values)
export const setAuthCookie = (name: string, value: string) => {
  setCookie(name, value, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
    // sameSite: 'strict',
    secure: process.env.NODE_ENV === "production",
  });
};

export const removeAuthCookie = (name: string) => {
  deleteCookie(name);
};

export const getAuthCookie = (name: string): string | null => {
  try {
    const cookie = getCookie(name);
    return cookie ? String(cookie) : null;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
};

// Get valid auth tokens from cookies with expiration check
export const getValidAuthTokens = () => {
  const token = getAuthCookie("token");
  const refreshToken = getAuthCookie("refreshToken");
  const expiresAtStr = getAuthCookie("expiresAt");

  // Check if token is expired
  const expiresAt = expiresAtStr ? parseInt(expiresAtStr) : null;
  const isTokenValid = token && expiresAt && Date.now() < expiresAt;

  return {
    token: isTokenValid ? token : undefined,
    refreshToken: isTokenValid ? refreshToken : undefined,
    isExpired: !isTokenValid,
  };
};

// Get complete auth state from cookies
export const getAuthState = () => {
  const token = getAuthCookie("token");
  const refreshToken = getAuthCookie("refreshToken");
  const isAuthenticatedStr = getAuthCookie("isAuthenticated");
  const expiresAtStr = getAuthCookie("expiresAt");

  const isAuthenticated = isAuthenticatedStr === "true";
  const expiresAt = expiresAtStr ? parseInt(expiresAtStr) : null;

  // Validate token expiration
  const isTokenValid = token && expiresAt && Date.now() < expiresAt;

  return {
    token: isTokenValid ? token : null,
    refreshToken: isTokenValid ? refreshToken : null,
    isAuthenticated: isTokenValid && isAuthenticated,
    expiresAt,
    isTokenValid,
  };
};

// Set complete auth state in flat cookies
export const setAuthState = (state: {
  token: string;
  refreshToken: string;
  expiresAt: number;
  isAuthenticated: boolean;
}) => {
  setAuthCookie("token", state.token);
  setAuthCookie("refreshToken", state.refreshToken);
  setAuthCookie("expiresAt", state.expiresAt.toString());
  setAuthCookie("isAuthenticated", state.isAuthenticated.toString());
};

// Clear all auth cookies
export const clearAllAuthCookies = () => {
  removeAuthCookie("token");
  removeAuthCookie("refreshToken");
  removeAuthCookie("expiresAt");
  removeAuthCookie("isAuthenticated");
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const authState = getAuthState();
  return authState.isAuthenticated === true && authState.isTokenValid === true;
};

// Helper to get token for API calls
export const getAuthToken = (): string | null => {
  const { token } = getValidAuthTokens();
  return token || null;
};
