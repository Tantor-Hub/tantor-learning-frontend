"use client";
import { Users } from "lucide-react";
import NewUser from "./components/new-user";
import TableUser from "./components/table-users";
import { userData } from "./data";

export default function Page() {
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>

        <NewUser />
      </div>

      {/* <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
        </div>
      </div> */}

      <TableUser userData={userData} />
    </div>
  );
}
