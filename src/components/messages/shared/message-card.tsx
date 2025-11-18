import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types/common/message-api";

type MessageCardProps = {
  message: IMessage;
  actions?: React.ReactNode;
};

export function MessageCard({ message, actions }: MessageCardProps) {
  const isSender = message.role === "sender";
  const isRead = isSender || message.isOpened;
  const senderName = `${message.sender.firstName} ${message.sender.lastName}`;
  const displayName =
    message.isTransferred && message.transferSender
      ? `${message.transferSender.firstName} ${message.transferSender.lastName} (Transféré)`
      : senderName;
  const avatar =
    message.isTransferred && message.transferSender?.avatar
      ? message.transferSender.avatar
      : message.sender.avatar;

  return (
    <Card
      className={cn(
        "transition-all overflow-hidden relative cursor-pointer hover:shadow-md p-4 border"
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={avatar || undefined} alt={displayName} />
          <AvatarFallback className="text-xs">
            {displayName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase() || "Expéditeur inconnu"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <p className={cn("text-sm font-medium truncate", !isRead)}>{displayName}</p>
              <p className={cn("text-sm truncate", !isRead)}>{message.subject}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {!isRead && !isSender && (
                <Badge variant="default" className="text-xs px-2 py-0.5">
                  Nouveau
                </Badge>
              )}
              {message.isTransferred && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  Transféré
                </Badge>
              )}
            </div>
          </div>
          {actions && <div className="mt-2">{actions}</div>}
        </div>
      </div>
    </Card>
  );
}
