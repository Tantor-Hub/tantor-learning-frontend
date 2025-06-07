import { useListChatByCategoryQuery } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";

export const DeletedMessagesTab = () => {
  const {
    data: deletedMessages,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
  } = useListChatByCategoryQuery({ group: "trash" });

  return (
    <MessageList
      messages={deletedMessages?.data.list}
      isLoading={isLoadingDeleted}
      isSuccess={isSuccessDeleted}
    />
  );
};
