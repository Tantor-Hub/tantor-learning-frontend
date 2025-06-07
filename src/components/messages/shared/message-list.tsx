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
  const role = pathname.split("/")[2]; // 'dashboard/student/messages' -> ['','dashboard','student','messages'
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
        <Link key={msg.id} href={`/dashboard/${role}/messages/${msg.id}`}>
          <MessageCard
            name={`${msg?.Sender?.fs_name} ${msg.Sender.ls_name}`}
            // role={msg.sender?.role || "Rôle inconnu"}
            title={msg.subject}
            message={msg.content}
            isRead={Boolean(msg.is_readed)}
            // date={msg.date_d_envoie}
          />
        </Link>
      ))}
    </div>
  );
};
