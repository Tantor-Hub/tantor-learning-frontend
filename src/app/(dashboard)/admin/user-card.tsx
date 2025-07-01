import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function UserCard({
  username,
  role,
  avatar,
  timestamp,
}: {
  username: string;
  avatar: string | null;
  timestamp: string;
  role: string;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        {/* Avatar circle */}
        <Avatar className="h-10 w-10 mr-3">
          {avatar ? (
            <AvatarImage src={avatar} alt={username} />
          ) : (
            <AvatarFallback className="text-gray-500 text-sm font-medium">
              {username
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{username}</span>
          <span className="text-sm text-gray-500">{timestamp}</span>
        </div>
      </div>
      <Badge
        variant="outline"
        className={`text-xs ${
          role === "Formateurs"
            ? "bg-blue-100 text-blue-600"
            : role === "Admin"
              ? "bg-red-100 text-red-600"
              : role === "Secrétariat & Administratif"
                ? "bg-green-100 text-green-600"
                : "bg-cyan-100 text-cyan-600"
        }`}
      >
        {role}
      </Badge>
    </div>
  );
}
