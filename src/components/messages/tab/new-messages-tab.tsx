import { useListChatByCategoryQuery } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";

export const NewMessagesTab = () => {
  const {
    data: newMessages,
    isLoading: isLoadingNew,
    isSuccess: isSuccessNew,
  } = useListChatByCategoryQuery({ group: "new" });

  return (
    <MessageList
      messages={newMessages?.data.rows}
      isLoading={isLoadingNew}
      isSuccess={isSuccessNew}
    />
  );
};
