"use client";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { SessionSelector } from "./session-selector";
import {
  selectSelectedSessionId,
  setSelectedSessionId,
} from "@/features/dashboard/dashboard-slice";

export function DashboardHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const selectedSessionId = useSelector(selectSelectedSessionId);
  const path = usePathname();

  const activeMenuItem = path.split("/")[2];
  const role = currentUser?.roles[1]?.role.toLowerCase();
  const isStudent = role === "étudiants";

  const title = getPageTitle(activeMenuItem);

  const handleSessionChange = (value: string) => {
    dispatch(setSelectedSessionId(value));
  };

  return (
    <header className="p-4 flex items-center justify-between border-b sticky top-0 z-50 backdrop-blur-xl bg-[#FFFFFFCC]">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold text-blue-600">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {isStudent && (
          <SessionSelector
            selectedSessionId={selectedSessionId}
            onSessionChange={handleSessionChange}
          />
        )}

        <Button size="icon" variant="outline" onClick={() => router.push(`/${role}/notifications`)}>
          <Bell />
        </Button>
      </div>
    </header>
  );
}

function getPageTitle(activeMenuItem: string): string {
  switch (activeMenuItem) {
    case "courses":
      return "Cours";
    case "documents":
      return "Documents";
    case "training":
      return "Formation";
    case "users":
      return "Utilisateurs";
    default:
      return activeMenuItem
        ? activeMenuItem[0].toUpperCase() + activeMenuItem.slice(1)
        : "Tableau de bord";
  }
}
