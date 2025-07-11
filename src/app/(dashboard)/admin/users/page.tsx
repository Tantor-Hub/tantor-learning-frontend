"use client";
import NewUser from "./new-user";
import TableUser from "./table-users";
import { userData } from "./data";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.back()}>
            <ChevronLeft /> Retour
          </Button>
          <NewUser />
        </div>
        <p className="truncate font-semibold text-xl">Gestion des utilisateurs</p>
      </div>
      <TableUser userData={userData} />
    </>
  );
}
