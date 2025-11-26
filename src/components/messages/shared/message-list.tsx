import Link from "next/link";
import { IMessage } from "@/types/common/message-api";
import { EmptyState } from "./empty-state";
import { MessageCard } from "./message-card";
import { MessageListSkeleton } from "@/components/skeletons/message-list-skeleton";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { useSelector } from "react-redux";

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
  const currentUser: any = useSelector(selectCurrentUser);

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
      {messages?.map((msg: IMessage) => (
        <Link
          href={`/${currentUser?.role}/messages/${msg.id}?istransfered=${msg.isTransferred ? "true" : "false"}&transferId=${msg.transferId ? msg.transferId : "null"}`}
          key={msg.id}
          className="cursor-pointer"
        >
          <MessageCard message={msg} actions={renderActions ? renderActions(msg) : undefined} />
        </Link>
      ))}
    </div>
  );
};
