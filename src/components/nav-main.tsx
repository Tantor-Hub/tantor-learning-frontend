"use client";
import { type LucideIcon } from "lucide-react";
import { SidebarGroup, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const pathname = usePathname();
  const currentSegment = pathname.trim().split("/").pop();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            className={`hover:bg-[#ECECEC] rounded-lg p-2 ${currentSegment == item.url.trim().split("/").pop() ? "bg-[#ececec]" : ""}`}
            key={item.title}
          >
            <Link href={`/dashboard/${item.url}`} className="flex items-center gap-6">
              <item.icon size={24} />
              <p>{item.title}</p>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
