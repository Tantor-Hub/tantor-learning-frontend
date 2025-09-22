import { useListChatByCategoryQuery } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";

export const ReceivedMessagesTab = () => {
  const {
    data: receivedMessages,
    isLoading: isLoadingReceived,
    isSuccess: isSuccessReceived,
  } = useListChatByCategoryQuery({ group: "inbox" });

  return (
    <MessageList
      messages={receivedMessages?.data.list}
      isLoading={isLoadingReceived}
      isSuccess={isSuccessReceived}
    />
  );
};
