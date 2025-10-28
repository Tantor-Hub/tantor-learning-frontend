import { useEffect } from "react";
import { useSelectedSession } from "./use-selected-session";
import { useGetUserSessionsByUserQuery } from "@/lib/apis/user-in-session";

export const useSessionAlert = () => {
  const selectedSessionId = useSelectedSession();
  const { data: sessions, isLoading } = useGetUserSessionsByUserQuery();

  useEffect(() => {
    if (!isLoading && (!sessions?.data || sessions.data.length === 0)) {
      // Clear localStorage related to selected session
      localStorage.removeItem("selectedSessionId");
      localStorage.removeItem("userSessions");
    }
  }, [sessions, isLoading]);

  const shouldShowAlert =
    !selectedSessionId || (!isLoading && (!sessions?.data || sessions.data.length === 0));

  return { shouldShowAlert, isLoading };
};
