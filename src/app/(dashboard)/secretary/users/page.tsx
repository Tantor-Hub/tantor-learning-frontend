import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, Plus } from "lucide-react";
import Image from "next/image";
import NewUser from "./components/new-user";
import TableUser from "./components/table-users";
import { userData } from "./data";

const UserManagement = () => {
  return (
    <section>
      <div className="flex flex-col md:flex-row gap-2.5 justify-between md:items-end mb-5">
        <h1>Gérez tous les cours disponibles sur la plateforme</h1>
        <NewUser />
      </div>
      <div className="flex flex-col sm:flex-row gap-5 justify-between md:gap-10 mb-5">
        <div className="flex items-center border px-2.5 rounded-md bg-white md:min-w-80">
          <Image src="/icons/search.svg" height={20} width={20} alt="search icon" />
          <Input
            type="search"
            className="text-[#ACACAC] border-none focus-visible:outline-none focus-visible:ring-0"
            placeholder="Rechercher ..."
          />
        </div>
        <div className="flex gap-5">
          <Button
            variant="outline"
            className="flex gap-2 items-center px-2.5 py-1 min-w-28 rounded-md bg-white border-[#0466C8] text-[#0466C8]"
          >
            <Download className="size-5" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            className="flex gap-2 items-center px-2.5 py-1 min-w-28 rounded-md bg-white border-[#0466C8] text-[#0466C8]"
          >
            <Filter className="size-5" />
            <span>Filtres</span>
          </Button>
        </div>
      </div>
      <TableUser userData={userData} />
    </section>
  );
};
export default UserManagement;
