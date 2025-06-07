import { useListChatQuery } from "@/lib/apis/common/chat-api";
import { NewMessageAlert } from "../shared/new-message";
import { MessageList } from "../shared/message-list";

export const AllMessagesTab = () => {
  const {
    data: allMessages,
    isLoading: isLoadingAll,
    isSuccess: isSuccessAll,
  } = useListChatQuery();
  // console.log(allMessages?.data.list);
  // const unreadCount = allMessages?.filter((msg) => !msg.isRead).length || 0;
  const unreadCount = 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <p>{unreadCount} message(s) non lu(s)</p>
        <NewMessageAlert />
      </div>
      <MessageList
        messages={allMessages?.data.list}
        isLoading={isLoadingAll}
        isSuccess={isSuccessAll}
      />
    </>
  );
};
