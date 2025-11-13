import Link from "next/link";
import { IGetAllMessagesResponse, IMessage } from "@/types/common/message-api";
import { EmptyState } from "./empty-state";
import { MessageCard } from "./message-card";
import { usePathname } from "next/navigation";
import { MessageListSkeleton } from "@/components/skeletons/message-list-skeleton";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { useSelector } from "react-redux";
import { useListMessageByUserIdQuery } from "@/lib/apis/common/chat-api";
import { useRouter } from "next/navigation";

interface MessageListProps {
  messages: IMessage[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  renderActions?: (msg: IMessage) => React.ReactNode;
}

export const MessageList = ({
  messages,
  isLoading,
  isSuccess,
  renderActions,
}: MessageListProps) => {
  const currentUser = useSelector(selectCurrentUser);
  const router = useRouter();

  if (isLoading) {
    return <MessageListSkeleton />;
  }

  // Show empty state if request succeeded but no messages
  if (isSuccess && (!messages || messages.length === 0)) {
    return <EmptyState />;
  }

  // If request hasn't succeeded or there's an error, don't show anything
  if (!isSuccess) {
    return null;
  }

  const handleClick = (msg: IMessage) => {
    router.push(`/${currentUser?.role}/messages/${msg.id}?threadId=${msg.id}`);
  };

  return (
    <div className="my-4 grid grid-cols-1 gap-4">
      {messages?.map((msg) => {
        const isSender = msg.role === "sender";
        const isRead = isSender || msg.isOpened;
        return (
          <div key={msg.id} onClick={() => handleClick(msg)} className="cursor-pointer">
            <MessageCard
              name={`${msg.sender.firstName} ${msg.sender.lastName}`}
              role=""
              title={msg.subject}
              message={msg.content}
              isRead={isRead}
              date={new Date(msg.createdAt)}
              isSender={isSender}
              actions={renderActions ? renderActions(msg) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
};
