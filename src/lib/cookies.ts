import { getCookie, setCookie, deleteCookie } from "cookies-next";

// helpers to get cookies
const getAuthCookie = (name: string) => {
  const cookie = getCookie(name);

  if (!cookie) return undefined;

  return Buffer.from(cookie as string, "base64").toString("ascii");
};

export const getValidAuthTokens = () => {
  const token = getAuthCookie("auth_token");

  if (!token) return { token: undefined };

  // For simplicity, we'll assume tokens are valid if they exist
  // In a real app, you might want to check expiration
  return {
    token,
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

export const removeAuthCookie = (name: string) => {
  deleteCookie(name);
};
