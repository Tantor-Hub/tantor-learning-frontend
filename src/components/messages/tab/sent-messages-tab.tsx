import { useListChatByCategoryQuery } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";

export const SentMessagesTab = () => {
  const {
    data: sentMessages,
    isLoading: isLoadingSent,
    isSuccess: isSuccessSent,
  } = useListChatByCategoryQuery({ group: "sent" });

  return (
    <MessageList
      messages={sentMessages?.data.list}
      isLoading={isLoadingSent}
      isSuccess={isSuccessSent}
    />
  );
};
