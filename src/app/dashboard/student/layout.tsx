import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <div className="max-w-[1440px] m-auto">
        <SidebarProvider style={{ margin: 0, padding: 0 }}>
          <AppSidebar />
          <SidebarInset style={{ border: "none", boxShadow: "none", borderRadius: 0, margin: 0 }}>
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <p className="text-xl text-primary font-bold">Tableau de bord-Etudiant</p>
              </div>
              <div className="flex items-center gap-4">
                <Input />
                <Bell size={24} />
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </header>
            <div className=" bg-[#EFEEEE] px-6 py-2.5 h-full w-full">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </section>
  );
}
