const TOKEN_KEY = "auth_tokens";

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

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    }
  },

  get: (): TokenData | null => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
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
