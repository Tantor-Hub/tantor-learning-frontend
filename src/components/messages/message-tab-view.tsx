"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllMessagesTab } from "./tab/all-messages-tab";
import { DeletedMessagesTab } from "./tab/deleted-messages-tab";
import { SentMessagesTab } from "./tab/sent-messages-tab";
import { ReceivedMessagesTab } from "./tab/received-messages-tab";
import { Button } from "../ui/button";
import { ChevronLeft, Mail, Send, Inbox, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageAlert } from "./shared/new-message";
import { Suspense, useState, useEffect } from "react";
import { NewMessageSkeleton } from "@/components/skeletons/new-message-skeleton";

export function MessageTabView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    // Simulate loading time or wait for actual refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft /> Retour
        </Button>
        <div className="flex items-center gap-4">
          {/* <RealtimeNotifications /> */}
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
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
            <AllMessagesTab refreshKey={refreshKey} />
          </div>
        </TabsContent>

        <TabsContent value="deleted">
          <DeletedMessagesTab refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="send">
          <SentMessagesTab refreshKey={refreshKey} />
        </TabsContent>

        <TabsContent value="received">
          <ReceivedMessagesTab refreshKey={refreshKey} />
        </TabsContent>
      </Tabs>
    </>
  );
}
