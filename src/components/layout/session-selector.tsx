"use client";
import { useGetUserSessionsQuery } from "@/lib/apis/student/training-api";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionSelectorProps {
  selectedSessionId: string | null;
  onSessionChange: (value: string) => void;
}

export function SessionSelector({ selectedSessionId, onSessionChange }: SessionSelectorProps) {
  const currentUser = useSelector(selectCurrentUser);

  const { data: sessions, isLoading } = useGetUserSessionsQuery(undefined, {
    skip: currentUser?.role !== "student",
  });

  if (isLoading) {
    return <div className="min-w-[300px] h-10 bg-gray-200 animate-pulse rounded-md" />;
  }

  return (
    <Select onValueChange={onSessionChange} value={selectedSessionId || ""}>
      <SelectTrigger className="min-w-[300px]">
        <SelectValue placeholder="Sélectionner une session" />
      </SelectTrigger>
      <SelectContent>
        {sessions?.data.map((session) => (
          <SelectItem key={session.trainingSession.id} value={session.trainingSession.id}>
            {session.trainingSession.title || "Session sans nom"} - {session.training.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
