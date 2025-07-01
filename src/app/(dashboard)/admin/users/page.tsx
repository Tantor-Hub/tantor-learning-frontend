"use client";
import NewUser from "./new-user";
import TableUser from "./table-users";
import { userData } from "./data";

export default function Page() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <NewUser />
      </div>
      <TableUser userData={userData} />
    </>
  );
}
