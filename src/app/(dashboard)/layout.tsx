"use client";
import { ReactNode, useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/auth/auth-slice";
import {
  selectSelectedSessionId,
  setSelectedSessionId,
} from "@/features/dashboard/dashboard-slice";
import { toast } from "react-hot-toast";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMySessionsQuery } from "@/lib/apis/student/training-api";
import { Loading } from "@/components/shared/loading";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const selectedSessionId = useSelector(selectSelectedSessionId);
  // console.log(currentUser?.roles);
  /* Later I will change with roles[0] - dev 1 - prod - 0 */
  const listSessions = useGetMySessionsQuery(undefined, {
    skip: currentUser?.roles[0]?.role.toLowerCase() !== "étudiants",
  });
  const role = currentUser?.roles[0]?.role.toLowerCase();
  const isStudent = role === "étudiants";
  /* Later I will change with roles[0] */
  const handleSessionChange = (value: string) => {
    dispatch(setSelectedSessionId(value));
  };

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const path = usePathname();
  const activeMenuItem = path.split("/")[2];

  const title =
    activeMenuItem == "courses"
      ? "Cours"
      : activeMenuItem == "documents"
        ? "Documents"
        : activeMenuItem == "training"
          ? "Formation"
          : activeMenuItem == "users"
            ? "Utilisateurs"
            : activeMenuItem
              ? activeMenuItem[0].toUpperCase() + activeMenuItem.slice(1)
              : "Tableau de bord";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
      toast("Veuillez vous connecter ou créer un compte pour accéder à votre tableau de bord");
    }
  }, [isAuthenticated, router]);

  // Show loader only for students when sessions are loading
  if (isStudent && listSessions.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loading />
      </div>
    );
  }

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

              <div className="flex items-center gap-2">
                {/* Only show select for students */}
                {isStudent && (
                  <Select onValueChange={handleSessionChange} value={selectedSessionId || ""}>
                    <SelectTrigger className="min-w-[300px]">
                      <SelectValue placeholder="Sélectionner une session" />
                    </SelectTrigger>
                    <SelectContent>
                      {listSessions.data?.data.list.map((session) => (
                        <SelectItem key={session.id} value={String(session.id)}>
                          {session.Session.designation || "Session sans nom"} -{" "}
                          {session.Formation.titre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => router.push(`/${role}/notifications`)}
                >
                  <Bell />
                </Button>
              </div>
            </header>
            <div className="p-3.5 h-full w-full bg-background">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </main>
  );
}
