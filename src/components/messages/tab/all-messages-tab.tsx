import { useListMessageByUserIdQuery } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";
import { Suspense, useEffect } from "react";
import { MessageListSkeleton } from "@/components/skeletons/message-list-skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AllMessagesTab = ({ refreshKey }: { refreshKey: number }) => {
  const { data, isLoading, isSuccess, isError, refetch } = useListMessageByUserIdQuery({});

  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-700">Erreur</h2>
        <p className="text-gray-500 text-center max-w-md">
          Une erreur s'est produite lors du chargement de tous les messages.
        </p>
        <p className="text-gray-500">Essayer de rafraîchir.</p>
        <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <MessageListSkeleton />;
  }
  return (
    <Suspense fallback={<MessageListSkeleton />}>
      <MessageList messages={data?.data?.rows} isLoading={isLoading} isSuccess={isSuccess} />
    </Suspense>
  );
};
