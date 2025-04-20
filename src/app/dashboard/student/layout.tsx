import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <div className="max-w-[1440px] m-auto">
        <SidebarProvider style={{ margin: 0, padding: 0 }}>
          <AppSidebar />
          <SidebarInset style={{ border: "none", boxShadow: "none", borderRadius: 0, margin: 0 }}>
            <header className="p-4 flex items-center justify-between border-b sticky top-0 z-50 backdrop-blur-xl bg-[#FFFFFFCC]">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold text-blue-600">Mes Documents</h1>
              </div>
              <div className="relative flex-1 mx-16">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* <div className="flex items-center gap-4">
                <button className="p-2">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-medium">user004</div>
                    <div className="text-xs text-green-500 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      En ligne
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div> */}
            </header>
            <div className=" bg-[#EFEEEE] p-3.5 h-full w-full">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </section>
  );
}
