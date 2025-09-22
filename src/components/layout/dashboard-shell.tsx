import { ReactNode, Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSkeleton, DashboardContentSkeleton } from "../skeletons/dashboard-skeleton";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <main>
      <div className="max-w-[1440px] m-auto">
        <SidebarProvider style={{ margin: 0, padding: 0 }}>
          <AppSidebar />
          <SidebarInset
            style={{
              border: "none",
              boxShadow: "none",
              borderRadius: 0,
              margin: 0,
            }}
          >
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardHeader />
              <div className="p-3.5 h-full w-full bg-background">
                <Suspense fallback={<DashboardContentSkeleton />}>{children}</Suspense>
              </div>
            </Suspense>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </main>
  );
}
