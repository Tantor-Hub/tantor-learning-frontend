"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllMessagesTab } from "./tab/all-messages-tab";
import { ArchivedMessagesTab } from "./tab/archived-messages-tab";
import { DeletedMessagesTab } from "./tab/deleted-messages-tab";
import { SentMessagesTab } from "./tab/sent-messages-tab";
import { ReceivedMessagesTab } from "./tab/received-messages-tab";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { NewMessageAlert } from "./shared/new-message";
import { RealtimeNotifications } from "./shared/realtime-notifications";
import { RealtimeComposer } from "./shared/realtime-composer";
import { WebSocketGuide } from "./shared/websocket-guide";

export function MessageTabView() {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          <RealtimeNotifications />
          <NewMessageAlert />
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="py-4 px-2.5 bg-white border font-semibold">
          <TabsTrigger value="all" className="p-3.5">
            Tous
          </TabsTrigger>
          <TabsTrigger value="archives" className="p-3.5">
            Archives
          </TabsTrigger>
          <TabsTrigger value="deleted" className="p-3.5">
            Supprimés
          </TabsTrigger>
          {/* <TabsTrigger value="new" className="p-3.5">
          Nouveaux
        </TabsTrigger> */}
          <TabsTrigger value="send" className="p-3.5">
            Envoyés
          </TabsTrigger>
          <TabsTrigger value="received" className="p-3.5">
            Reçus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            <WebSocketGuide />
            <RealtimeComposer />
            <AllMessagesTab />
          </div>
        </TabsContent>

        <TabsContent value="archives">
          <ArchivedMessagesTab />
        </TabsContent>

        <TabsContent value="deleted">
          <DeletedMessagesTab />
        </TabsContent>

        {/* <TabsContent value="new">
        <NewMessagesTab />
      </TabsContent> */}

        <TabsContent value="send">
          <SentMessagesTab />
        </TabsContent>

        <TabsContent value="received">
          <ReceivedMessagesTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
