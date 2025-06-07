"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllMessagesTab } from "./tab/all-messages-tab";
import { ArchivedMessagesTab } from "./tab/archived-messages-tab";
import { DeletedMessagesTab } from "./tab/deleted-messages-tab";
// import { NewMessagesTab } from "./tab/new-messages-tab";
import { SentMessagesTab } from "./tab/sent-messages-tab";
import { ReceivedMessagesTab } from "./tab/received-messages-tab";

export function MessageTabView() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full mb-8 px-2.5 py-6 bg-white border font-semibold">
        <TabsTrigger value="all" className="p-5 px-2 md:px-5">
          Tous
        </TabsTrigger>
        <TabsTrigger value="archives" className="p-5 px-2 md:px-5">
          Archives
        </TabsTrigger>
        <TabsTrigger value="deleted" className="p-5 px-2 md:px-5">
          Supprimés
        </TabsTrigger>
        {/* <TabsTrigger value="new" className="p-5 px-2 md:px-5">
          Nouveaux
        </TabsTrigger> */}
        <TabsTrigger value="send" className="p-5 px-2 md:px-5">
          Envoyés
        </TabsTrigger>
        <TabsTrigger value="received" className="p-5 px-2 md:px-5">
          Reçus
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <AllMessagesTab />
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
  );
}
