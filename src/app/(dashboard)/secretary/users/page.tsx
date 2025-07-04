"use client";
import TableUser from "./table-users";
import { userData } from "./data";

export default function Page() {
  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Gestion des utilisateurs</p>
      </div>
      <TableUser userData={userData} />
    </>
  );
}
