import { useListMessageByUserIdQuery } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";
import { Suspense } from "react";
import { MessageListSkeleton } from "@/components/skeletons/message-list-skeleton";

export const AllMessagesTab = () => {
  const { data, isLoading, isSuccess } = useListMessageByUserIdQuery({});
  if (isLoading) {
    return <MessageListSkeleton />;
  }
  return (
    <Suspense fallback={<MessageListSkeleton />}>
      <MessageList messages={data?.data?.rows} isLoading={isLoading} isSuccess={isSuccess} />
    </Suspense>
  );
};
