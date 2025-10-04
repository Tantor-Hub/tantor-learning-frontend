"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllMessagesTab } from "./tab/all-messages-tab";
import { DeletedMessagesTab } from "./tab/deleted-messages-tab";
import { SentMessagesTab } from "./tab/sent-messages-tab";
import { ReceivedMessagesTab } from "./tab/received-messages-tab";
import { Button } from "../ui/button";
import { ChevronLeft, Mail, Send, Inbox, Trash2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { MessageAlert } from "./shared/new-message";
import { RealtimeNotifications } from "./shared/realtime-notifications";
import { RealtimeComposer } from "./shared/realtime-composer";
import { WebSocketGuide } from "./shared/websocket-guide";
import { Suspense, useState } from "react";
import { NewMessageSkeleton } from "@/components/skeletons/new-message-skeleton";

export function MessageTabView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          {/* <RealtimeNotifications /> */}
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refraichir
          </Button>
          <Suspense fallback={<NewMessageSkeleton />}>
            <MessageAlert />
          </Suspense>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="py-4 px-2.5 bg-white border font-semibold">
          <TabsTrigger value="all" className="p-3.5 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Tous
          </TabsTrigger>
          <TabsTrigger value="received" className="p-3.5 flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Reçus
          </TabsTrigger>

          <TabsTrigger value="send" className="p-3.5 flex items-center gap-2">
            <Send className="h-4 w-4" />
            Envoyés
          </TabsTrigger>

          <TabsTrigger value="deleted" className="p-3.5 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Corbeille
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            <AllMessagesTab refreshKey={activeTab === "all" ? refreshKey : 0} />
          </div>
        </TabsContent>

        <TabsContent value="deleted">
          <DeletedMessagesTab refreshKey={activeTab === "deleted" ? refreshKey : 0} />
        </TabsContent>

        <TabsContent value="send">
          <SentMessagesTab refreshKey={activeTab === "send" ? refreshKey : 0} />
        </TabsContent>

        <TabsContent value="received">
          <ReceivedMessagesTab refreshKey={activeTab === "received" ? refreshKey : 0} />
        </TabsContent>
      </Tabs>
    </>
  );
}
