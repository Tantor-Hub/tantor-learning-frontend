import { useEffect } from "react";
import { useListReceivedMessagesQuery } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";
import Image from "next/image";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ReceivedMessagesTab = ({ refreshKey }: { refreshKey: number }) => {
  const {
    data: receivedMessages,
    isLoading: isLoadingReceived,
    isSuccess: isSuccessReceived,
    isError,
    refetch,
  } = useListReceivedMessagesQuery();

  useEffect(() => {
    if (refreshKey > 0) {
      refetch();
    }
  }, [refreshKey, refetch]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-700">Erreur</h2>
        <p className="text-gray-500 text-center max-w-md">
          Une erreur s'est produite lors du chargement des messages reçus.
        </p>
        <p className="text-gray-500">Essayer de rafraîchir.</p>
        <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </Button>
      </div>
    );
  }

  if (isLoadingReceived) {
    return <MessageList messages={[]} isLoading={true} isSuccess={false} />;
  }

  if (
    isSuccessReceived &&
    (!receivedMessages?.data?.rows || receivedMessages.data.rows.length === 0)
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative w-64 h-64">
          <Image src="/empty.svg" alt="Aucun message reçu" fill className="object-contain" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Aucun message reçu</h2>
        <p className="text-gray-500 text-center max-w-md">
          Vous n'avez reçu aucun message pour le moment.
        </p>
      </div>
    );
  }

  return (
    <MessageList
      messages={receivedMessages?.data?.rows}
      isLoading={isLoadingReceived}
      isSuccess={isSuccessReceived}
    />
  );
};
