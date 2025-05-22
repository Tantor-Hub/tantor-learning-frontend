"use client";
import { ReactNode } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Search, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const path = usePathname();
  const activeMenuItem = path.split("/")[3];
  const title =
    activeMenuItem == "courses"
      ? "Mes cours"
      : activeMenuItem == "documents"
        ? "Mes Documents"
        : activeMenuItem == "training"
          ? "Ma Formation"
          : activeMenuItem
            ? activeMenuItem[0].toUpperCase() + activeMenuItem.slice(1)
            : "Tableau de bord";

  return (
    <main>
      <div className="max-w-[1440px] m-auto">
        <SidebarProvider style={{ margin: 0, padding: 0 }}>
          <AppSidebar />
          <SidebarInset style={{ border: "none", boxShadow: "none", borderRadius: 0, margin: 0 }}>
            <header className="p-4 flex items-center justify-between border-b sticky top-0 z-50 backdrop-blur-xl bg-[#FFFFFFCC]">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold text-blue-600">{title}</h1>
              </div>
              <Bell className="mr-4" />
            </header>
            <div className="p-3.5 h-full w-full bg-background">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </main>
  );
}
