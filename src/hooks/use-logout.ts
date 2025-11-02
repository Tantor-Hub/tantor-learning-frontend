"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"; // Use regular useDispatch
import { useLogoutMutation } from "@/lib/apis/auth-api";
import { clearCredentials } from "@/features/auth/auth-slice";
import { tokenStorage } from "@/features/token-storage";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch(); // Changed from useAppDispatch
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async (redirectToLogin = true) => {
    try {
      // Call logout API to invalidate tokens on server
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout API fails, we still clear local tokens
      console.error("Logout API failed:", error);
    } finally {
      // Clear Redux state
      dispatch(clearCredentials());

      // Clear local storage and cookies
      tokenStorage.clear();

      // Clear user data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      // Redirect to login page
      if (redirectToLogin) {
        router.push("/signin");
      }
    }
  };

  return { logout: handleLogout };
};
