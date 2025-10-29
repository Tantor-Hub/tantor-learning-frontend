import {
  setAuthCookie,
  setRefreshTokenCookie,
  getValidAuthTokens,
  removeAuthCookie,
  removeRefreshTokenCookie,
} from "@/lib/cookies";

interface TokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
}

export const tokenStorage = {
  save: (tokens: { accessToken: string; refreshToken: string }) => {
    const now = Date.now();
    const tokenData: TokenData = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiration: now + 22 * 60 * 60 * 1000, // 22 hours
      refreshTokenExpiration: now + 48 * 60 * 60 * 1000, // 48 hours
    };

    // Store tokens in cookies
    setAuthCookie(tokens.accessToken, "token");
    setRefreshTokenCookie(tokens.refreshToken);

    // Store expiration times in localStorage for expiration checks
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "token_expirations",
        JSON.stringify({
          accessTokenExpiration: tokenData.accessTokenExpiration,
          refreshTokenExpiration: tokenData.refreshTokenExpiration,
        })
      );
    }
  },

  get: (): TokenData | null => {
    const tokens = getValidAuthTokens();
    if (!tokens.token || !tokens.refreshToken) return null;

    // Get expiration times from localStorage
    if (typeof window === "undefined") return null;

    const expirations = localStorage.getItem("token_expirations");
    if (!expirations) return null;

    try {
      const { accessTokenExpiration, refreshTokenExpiration } = JSON.parse(expirations);
      return {
        accessToken: tokens.token,
        refreshToken: tokens.refreshToken,
        accessTokenExpiration,
        refreshTokenExpiration,
      };
    } catch {
      return null;
    }
  },

  clear: () => {
    removeAuthCookie("token");
    removeRefreshTokenCookie();

    if (typeof window !== "undefined") {
      localStorage.removeItem("token_expirations");
    }
  },

  isAccessTokenExpired: (): boolean => {
    const tokens = tokenStorage.get();
    if (!tokens) return true;

    return Date.now() >= tokens.accessTokenExpiration;
  },

  isRefreshTokenExpired: (): boolean => {
    const tokens = tokenStorage.get();
    if (!tokens) return true;

    return Date.now() >= tokens.refreshTokenExpiration;
  },

  shouldRefreshToken: (): boolean => {
    const tokens = tokenStorage.get();
    if (!tokens) return false;

    // Refresh if access token expires in next 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() + fiveMinutes >= tokens.accessTokenExpiration;
  },
};
