"use client";
import * as React from "react";
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
import navigationMenus, { Role, otherNav } from "../data/sidebar-links";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const path = usePathname();
  const role = path.split("/")[1] as Role;
  return (
    <Sidebar variant="inset" {...props} className="p-0 border-r border-border px-2 sticky top-0">
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
        <NavMain items={navigationMenus[role]} />
        <NavSecondary items={otherNav.navSecondary[role]} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
