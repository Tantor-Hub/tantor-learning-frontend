// Utility to sync auth state between localStorage and cookies
// This should be called on the client side whenever auth state changes

export const syncAuthToCookies = () => {
  if (typeof window === "undefined") return;

  try {
    const authState = localStorage.getItem("authState");
    if (authState) {
      // Set a cookie with the auth state that will be accessible to middleware
      document.cookie = `authState=${encodeURIComponent(authState)}; path=/; max-age=86400`; // 24 hours
    } else {
      // Clear the cookie if no auth state
      document.cookie = "authState=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  } catch (error) {
    console.error("Failed to sync auth to cookies:", error);
  }
};

// Call this function whenever your auth state changes
// For example, after login, logout, or token refresh
