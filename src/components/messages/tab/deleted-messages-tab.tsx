import { useListDeletedMessagesQuery, useRestoreChatMutation } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";
import { Suspense } from "react";
import { MessageListSkeleton } from "@/components/skeletons/message-list-skeleton";
import { TrashIcon, AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMessage } from "@/types/common/message-api";
import toast from "react-hot-toast";

import { useEffect } from "react";

export const DeletedMessagesTab = ({ refreshKey }: { refreshKey: number }) => {
  const { data, isLoading, isSuccess, isError, refetch } = useListDeletedMessagesQuery();
  const [restoreChat] = useRestoreChatMutation();

  useEffect(() => {
    if (refreshKey > 0) {
      refetch();
    }
  }, [refreshKey, refetch]);

  if (isError) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-700">Erreur</h2>
          <p className="text-gray-500 text-center max-w-md">
            Une erreur s'est produite lors du chargement des messages supprimés.
          </p>
          <p className="text-gray-500">Essayer de rafraîchir.</p>
          <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
      </div>
    );
  }

  const handleRestore = async (msg: IMessage) => {
    try {
      await restoreChat({ id: msg.id }).unwrap();
      toast.success("Message restauré avec succès.");
      refetch();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la restauration du message.");
    }
  };

  if (isLoading) {
    return <MessageListSkeleton />;
  }

  return (
    <Suspense fallback={<MessageListSkeleton />}>
      <MessageList
        messages={data?.data?.rows}
        isLoading={isLoading}
        isSuccess={isSuccess}
        renderActions={(msg) => (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRestore(msg);
            }}
            className="flex items-center gap-2"
          >
            <RotateCcw />
            Restaurer
          </Button>
        )}
      />
    </Suspense>
  );
};
