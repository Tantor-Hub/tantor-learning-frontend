"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCard } from "./message-card";
import Image from "next/image";
import Link from "next/link";
import { NewMessageAlert } from "./new-message";
import { useListMessageQuery, useListMessageByCategoryQuery } from "@/lib/apis/messages-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "@/lib/apis/messages-api";

export function TabsView() {
  // Ajout de isSuccess pour chaque requête
  const {
    data: allMessages,
    isLoading: isLoadingAll,
    isSuccess: isSuccessAll,
  } = useListMessageQuery();

  const {
    data: archivedMessages,
    isLoading: isLoadingArchived,
    isSuccess: isSuccessArchived,
  } = useListMessageByCategoryQuery({ group: "archived" });

  const {
    data: deletedMessages,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
  } = useListMessageByCategoryQuery({ group: "deleted" });

  const {
    data: newMessages,
    isLoading: isLoadingNew,
    isSuccess: isSuccessNew,
  } = useListMessageByCategoryQuery({ group: "new" });

  const {
    data: sentMessages,
    isLoading: isLoadingSent,
    isSuccess: isSuccessSent,
  } = useListMessageByCategoryQuery({ group: "sent" });

  const {
    data: receivedMessages,
    isLoading: isLoadingReceived,
    isSuccess: isSuccessReceived,
  } = useListMessageByCategoryQuery({ group: "received" });

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative w-64 h-64">
        <Image src="/empty.svg" alt="Aucun message" fill className="object-contain" />
      </div>
      <h2 className="text-xl font-semibold text-gray-700">Aucun message disponible</h2>
      <p className="text-gray-500 text-center max-w-md">
        Vous n'avez aucun message dans cette section pour le moment.
      </p>
      <NewMessageAlert />
    </div>
  );

  const renderMessages = (
    messages: Message[] | undefined,
    isLoading: boolean,
    isSuccess: boolean
  ) => {
    if (isSuccess) {
      return (
        <div className="my-4 grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    // Afficher l'état vide seulement si la requête a réussi mais il n'y a pas de messages
    if (!isSuccess && (!messages || messages.length === 0)) {
      return <EmptyState />;
    }

    // Si la requête n'a pas encore réussi ou s'il y a une erreur, ne rien afficher
    if (!isSuccess) {
      return null;
    }

    return (
      <div className="my-4 grid grid-cols-1 gap-4">
        {messages?.map((msg) => (
          <Link key={msg.id} href={`/dashboard/instructor/messages/${msg.id}`}>
            <div>Hello Messages</div>
            {/* <MessageCard
              name={msg.sender?.name || "Expéditeur inconnu"}
              role={msg.sender?.role || "Rôle inconnu"}
              title={msg.subject}
              message={msg.content}
              isRead={msg.isRead}
              date={new Date(msg.createdAt).toLocaleDateString()}
            /> */}
          </Link>
        ))}
      </div>
    );
  };

  // const unreadCount = allMessages?.filter((msg) => !msg.isRead).length || 0;
  const unreadCount = 0;

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
        <TabsTrigger value="new" className="p-5 px-2 md:px-5">
          Nouveaux
        </TabsTrigger>
        <TabsTrigger value="send" className="p-5 px-2 md:px-5">
          Envoyés
        </TabsTrigger>
        <TabsTrigger value="received" className="p-5 px-2 md:px-5">
          Reçus
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="flex items-center justify-between">
          <p>{unreadCount} message(s) non lu(s)</p>
          <NewMessageAlert />
        </div>
        {renderMessages(allMessages, isLoadingAll, isSuccessAll)}
      </TabsContent>

      <TabsContent value="archives">
        {renderMessages(archivedMessages, isLoadingArchived, isSuccessArchived)}
      </TabsContent>

      <TabsContent value="deleted">
        {renderMessages(deletedMessages, isLoadingDeleted, isSuccessDeleted)}
      </TabsContent>

      <TabsContent value="new">
        {renderMessages(newMessages, isLoadingNew, isSuccessNew)}
      </TabsContent>

      <TabsContent value="send">
        {renderMessages(sentMessages, isLoadingSent, isSuccessSent)}
      </TabsContent>

      <TabsContent value="received">
        {renderMessages(receivedMessages, isLoadingReceived, isSuccessReceived)}
      </TabsContent>
    </Tabs>
  );
}
