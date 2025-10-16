import { useEffect } from "react";
import { useGetMySessionsQuery } from "@/lib/apis/student/training-api";
import { useSelectedSession } from "./use-selected-session";

export const useSessionAlert = () => {
  const selectedSessionId = useSelectedSession();
  const { data: sessions, isLoading } = useGetMySessionsQuery();

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
