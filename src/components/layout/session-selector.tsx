"use client";
import { useEffect, useState } from "react";
import { useGetUserSessionsByUserQuery } from "../../lib/apis/user-in-session";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SessionSelectorProps {
  selectedSessionId: string | null;
  onSessionChange: (value: string) => void;
}

export function SessionSelector({ selectedSessionId, onSessionChange }: SessionSelectorProps) {
  const currentUser = useSelector(selectCurrentUser);
  const [openDialog, setOpenDialog] = useState(false);
  const [localSessions, setLocalSessions] = useState<any[]>([]);
  const [selectedInDialog, setSelectedInDialog] = useState<string>("");
  const [fetchSessions, setFetchSessions] = useState(false);

  const {
    data: sessions,
    isLoading,
    refetch,
  } = useGetUserSessionsByUserQuery(undefined, {
    skip: currentUser?.role !== "student" || !fetchSessions,
  });

  // Load sessions from localStorage on mount and set first if no selected
  useEffect(() => {
    const savedSessions = localStorage.getItem("userSessions");
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setLocalSessions(parsed);
      if (!selectedSessionId) {
        const firstId = parsed[0]?.trainingSession.id;
        if (firstId) onSessionChange(firstId);
      }
    }
  }, [selectedSessionId, onSessionChange]);

  // Load selectedSessionId from localStorage if not set
  useEffect(() => {
    const savedSelected = localStorage.getItem("selectedSessionId");
    if (savedSelected && !selectedSessionId) {
      onSessionChange(savedSelected);
    }
  }, [selectedSessionId, onSessionChange]);

  // When sessions data is loaded, update localStorage and set first if no selected
  useEffect(() => {
    if (sessions?.data) {
      localStorage.setItem("userSessions", JSON.stringify(sessions.data));
      setLocalSessions(sessions.data);
      if (!selectedSessionId) {
        const firstId = sessions.data[0]?.trainingSession.id;
        if (firstId) onSessionChange(firstId);
      }
      setSelectedInDialog(selectedSessionId || sessions.data[0]?.trainingSession.id || "");
    }
  }, [sessions?.data, selectedSessionId, onSessionChange]);

  // Persist selectedSessionId to localStorage
  const handleSessionChange = (value: string) => {
    onSessionChange(value);
    localStorage.setItem("selectedSessionId", value);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    if (fetchSessions) {
      refetch();
    } else {
      setFetchSessions(true);
    }
    setSelectedInDialog(selectedSessionId || localSessions[0]?.trainingSession.id || "");
  };

  if (isLoading && fetchSessions) {
    return <div className="min-w-[300px] h-10 bg-gray-200 animate-pulse rounded-md" />;
  }

  const selectedSession =
    localSessions.find((s) => s.trainingSession.id === selectedSessionId) || localSessions[0];

  return (
    <>
      <Button variant="outline" onClick={handleOpenDialog} className="min-w-[300px] justify-start">
        {selectedSession
          ? `${selectedSession.trainingSession.title || "Session sans nom"} - ${selectedSession.training.title}`
          : "Sélectionner une session"}
      </Button>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Badge variant="outline" className="py-1">
                Sessions
              </Badge>
            </div>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight">
              Sélectionner une session
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-3 text-[15px]">
              Choisissez une session pour continuer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {localSessions.map((session) => (
              <Button
                key={session.trainingSession.id}
                variant={selectedInDialog === session.trainingSession.id ? "default" : "outline"}
                onClick={() => setSelectedInDialog(session.trainingSession.id)}
                className="w-full justify-start"
              >
                {session.trainingSession.title || "Session sans nom"} - {session.training.title}
              </Button>
            ))}
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleSessionChange(selectedInDialog);
                setOpenDialog(false);
              }}
            >
              Continuer <ArrowRight />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
