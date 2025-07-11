import { Bell } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function Notification() {
  const [isActive, setIsActive] = useState(true);

  // Mock notification data
  const notifications = [
    { id: 1, text: "Your training session starts tomorrow", time: "2 hours ago", isNew: true },
    { id: 2, text: "New course available in your category", time: "1 day ago", isNew: true },
    { id: 3, text: "Your submission has been approved", time: "3 days ago", isNew: false },
    { id: 4, text: "Weekly progress report is ready", time: "4 days ago", isNew: false },
    { id: 5, text: "New message from your instructor", time: "5 days ago", isNew: true },
    { id: 6, text: "Course deadline reminder", time: "1 week ago", isNew: false },
    { id: 7, text: "Certificate awarded for completion", time: "1 week ago", isNew: false },
    { id: 8, text: "New assignment uploaded", time: "2 weeks ago", isNew: false },
  ];

  const handleNotificationClick = () => {
    setIsActive(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="relative"
          onClick={handleNotificationClick}
        >
          <Bell className={`size-5 ${isActive ? "text-primary" : "text-secondary-foreground"}`} />
          {notifications.length > 0 && isActive && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs text-white"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-[500px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 relative"
                >
                  <div className="flex items-start gap-3">
                    {isActive && notification.isNew && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No new notifications</p>
          )}

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              Statut: {isActive ? "Actif" : "Inactif"} • {notifications.length} notification(s)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
