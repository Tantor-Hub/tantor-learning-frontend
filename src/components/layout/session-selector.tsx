"use client";
import { useGetMySessionsQuery } from "@/lib/apis/student/training-api";
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

  const { data: sessions, isLoading } = useGetMySessionsQuery(undefined, {
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
        {sessions?.data.list.map((session) => (
          <SelectItem key={session.id} value={String(session.id)}>
            {session.Session.designation || "Session sans nom"} - {session.Formation.titre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
