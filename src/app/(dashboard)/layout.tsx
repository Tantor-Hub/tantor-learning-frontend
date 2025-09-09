import { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardProvider } from "@/components/providers/dashboard-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
