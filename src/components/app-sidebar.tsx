"use client";
import * as React from "react";
import {
  FileText,
  Users,
  LayoutDashboard,
  ChartColumn,
  CalendarDays,
  Settings,
  CircleHelp,
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
  SidebarMenuButton,
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
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Mes Cours",
      url: "#",
      icon: FileText,
      items: [],
    },
    {
      title: "Formateur",
      url: "#",
      icon: Users,
      items: [],
    },
    {
      title: "Mes Documents",
      url: "#",
      icon: ChartColumn,
      items: [],
    },
    {
      title: "Planning",
      url: "#",
      icon: CalendarDays,
      items: [],
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "#",
      icon: Settings,
    },
    {
      title: "Support",
      url: "#",
      icon: CircleHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} className="p-0 border-r border-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-4">
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
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter className="bg-white">
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
