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

  // Get the first two segments of the current path
  const currentPathSegments = pathname.trim().split("/").filter(Boolean);
  const currentBasePath =
    currentPathSegments.length > 1
      ? `/${currentPathSegments[0]}/${currentPathSegments[1]}`
      : `/${currentPathSegments[0] || ""}`;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // Get the first two segments of the item's URL
          const itemPathSegments = item.url.trim().split("/").filter(Boolean);
          const itemBasePath =
            itemPathSegments.length > 1
              ? `/${itemPathSegments[0]}/${itemPathSegments[1]}`
              : `/${itemPathSegments[0] || ""}`;

          const isActive = currentBasePath === itemBasePath;

          return (
            <SidebarMenuItem
              className={`hover:bg-[#ECECEC] rounded-lg p-2 ${isActive ? "bg-[#ececec]" : ""}`}
              key={item.title}
            >
              <Link href={`/${item.url}`} className="flex items-center gap-6">
                <item.icon size={24} />
                <p>{item.title}</p>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
