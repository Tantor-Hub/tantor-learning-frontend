"use client";
import * as React from "react";
import {
  FileText,
  LayoutDashboard,
  ChartColumn,
  CalendarDays,
  Settings,
  CircleHelp,
  MessageCircleMore,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tableau de bord",
      url: "student",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Mes Cours",
      url: "student/courses",
      icon: FileText,
    },
    {
      title: "Messages",
      url: "student/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Mes Documents",
      url: "student/documents",
      icon: ChartColumn,
    },
    {
      title: "Planning",
      url: "student/planning",
      icon: CalendarDays,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "student/settings",
      icon: Settings,
    },
    {
      title: "Support",
      url: "student/support",
      icon: CircleHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} className="p-0 border-r border-border px-2">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-4 py-4">
              <div className="flex aspect-square size-8 items-center justify-center">
                <Image
                  src="/tantor-logo.svg"
                  alt="Tantor Logo"
                  width={48}
                  height={48}
                  className="size-12"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-xl">Tantor Learning</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent style={{ marginTop: 5 }}>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
