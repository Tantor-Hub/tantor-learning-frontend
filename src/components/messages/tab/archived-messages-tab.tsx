import { useListChatByCategoryQuery } from "@/lib/apis/common/chat-api";
import { MessageList } from "../shared/message-list";

export const ArchivedMessagesTab = () => {
  const {
    data: archivedMessages,
    isLoading: isLoadingArchived,
    isSuccess: isSuccessArchived,
  } = useListChatByCategoryQuery({ group: "archived" });
  // const list = archivedMessages?.data.list;
  return (
    <MessageList
      messages={archivedMessages?.data.rows}
      isLoading={isLoadingArchived}
      isSuccess={isSuccessArchived}
    />
  );
};
