import Link from "next/link";
import { IGetAllMessagesResponse, IMessage } from "@/types/common/message-api";
import { EmptyState } from "./empty-state";
import { MessageCard } from "./message-card";
import { usePathname } from "next/navigation";
import { Loading } from "@/components/shared/loading";
interface MessageListProps {
  messages: IMessage[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
}

export const MessageList = ({ messages, isLoading, isSuccess }: MessageListProps) => {
  const pathname = usePathname();
  // Extract the role: 'student' or 'admin' ...
  const role = pathname.split("/")[1]; // '/student/messages' -> ['','dashboard','student','messages'
  if (isLoading) {
    return <Loading />;
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
      {messages?.map((msg) => (
        <Link key={msg.id} href={`/${role}/messages/${msg.id}?threadId=${msg.thread}`}>
          <MessageCard
            name={`${msg?.Sender?.fs_name} ${msg.Sender.ls_name}`}
            role={msg.Sender.roles.length > 0 ? msg.Sender.roles.map((r) => r.role).join(", ") : ""}
            title={msg.subject}
            message={msg.content}
            isRead={Boolean(0)}
            date={new Date(msg.date_d_envoie)}
          />
        </Link>
      ))}
    </div>
  );
};
