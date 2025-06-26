import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
};

export function MessageCard({ name, role, title, message, isRead, date }: MessageCardProps) {
  // bg-[#E8F0FF]
  return (
    <Card className={cn("transition-all overflow-hidden", !isRead && "")}>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "Expéditeur inconnu"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
        </div>
        <Badge>
          {date.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="font-bold mb-2 text-base">{title}</p>
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}
