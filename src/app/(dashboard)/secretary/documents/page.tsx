"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLazyGetAllTrainingSessionsSimplifiedQuery } from "@/lib/apis/training-sessions";
import { Loading } from "@/components/shared/loading";
import { PendingTab } from "./pending";
import { ValidatedTab } from "./validated";
import { RejectedTab } from "./rejected";

export default function Page() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [trigger, { data: sessionsData, isLoading, isError }] =
    useLazyGetAllTrainingSessionsSimplifiedQuery();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !sessionsData && !isLoading) {
      trigger();
    }
  };

  if (isError) {
    return <div>Erreur lors du chargement des sessions.</div>;
  }

  const sessions = sessionsData?.data || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-5 md:gap-10">
        <div className="flex justify-start mb-4">
          <Select
            open={isOpen}
            onOpenChange={handleOpenChange}
            onValueChange={(value) => setSelectedSession(value)}
            value={selectedSession || undefined}
          >
            <SelectTrigger className="min-w-[300px]">
              <SelectValue placeholder="Sélectionner une session" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center justify-center py-2">
                    <Loading />
                  </div>
                </SelectItem>
              ) : sessions.length === 0 ? (
                <SelectItem value="empty" disabled>
                  Aucune session disponible
                </SelectItem>
              ) : (
                sessions.map((session) => (
                  <SelectItem key={session.sessionId} value={session.sessionId}>
                    {`${session.sessionTitle} - ${session.trainingTitle}`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="validated">
        <div className="overflow-x-auto">
          <TabsList className="flex min-w-[1000px] w-full bg-white border">
            <TabsTrigger value="validated">validé</TabsTrigger>
            <TabsTrigger value="pending">En Attente</TabsTrigger>
            <TabsTrigger value="rejected">Rejetée</TabsTrigger>
          </TabsList>

          <TabsContent value="validated">
            <ValidatedTab sessionId={selectedSession} />
          </TabsContent>
          <TabsContent value="pending">
            <PendingTab sessionId={selectedSession} />
          </TabsContent>
          <TabsContent value="rejected">
            <RejectedTab sessionId={selectedSession} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
