import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type MessageCardProps = {
  name: string;
  role?: string;
  title: string;
  message: string;
  isRead: boolean;
  date: Date;
  isSender: boolean;
};

export function MessageCard({
  name,
  role,
  title,
  message,
  isRead,
  date,
  isSender,
}: MessageCardProps) {
  return (
    <Card
      className={cn(
        "transition-all overflow-hidden relative cursor-pointer hover:shadow-md p-4 border"
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="text-xs">
            {name
              .split(" ")
              .reverse()
              .join(" ")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "Expéditeur inconnu"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <p className={cn("text-sm font-medium truncate", !isRead)}>{name}</p>
              <p className={cn("text-sm truncate", !isRead)}>{title}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-muted-foreground">
                {date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {!isRead && !isSender && (
                <Badge variant="default" className="text-xs px-2 py-0.5">
                  Nouveau
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
