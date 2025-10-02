import Link from "next/link";
import { IGetAllMessagesResponse, IMessage } from "@/types/common/message-api";
import { EmptyState } from "./empty-state";
import { MessageCard } from "./message-card";
import { usePathname } from "next/navigation";
import { MessageListSkeleton } from "@/components/skeletons/message-list-skeleton";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { useSelector } from "react-redux";
import { useListMessageByUserIdQuery } from "@/lib/apis/common/chat-api";
interface MessageListProps {
  messages: IMessage[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
}

export const MessageList = ({ messages, isLoading, isSuccess }: MessageListProps) => {
  const currentUser = useSelector(selectCurrentUser);

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

  return (
    <div className="my-4 grid grid-cols-1 gap-4">
      {messages?.map((msg) => {
        const isRead = msg.reader.includes(currentUser?.id || "");
        return (
          <Link key={msg.id} href={`/${currentUser?.role}/messages/${msg.id}?threadId=${msg.id}`}>
            <MessageCard
              name={`${msg.sender.firstName} ${msg.sender.lastName}`}
              role=""
              title={msg.subject}
              message={msg.content}
              isRead={isRead}
              date={new Date(msg.createdAt)}
            />
          </Link>
        );
      })}
    </div>
  );
};
