import { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthWrapper } from "@/components/AuthWrapper";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthWrapper>
      <DashboardShell>{children}</DashboardShell>
    </AuthWrapper>
  );
}
