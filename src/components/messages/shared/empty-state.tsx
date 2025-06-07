import Image from "next/image";
import { NewMessageAlert } from "./new-message";

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="relative w-64 h-64">
      <Image src="/empty.svg" alt="Aucun message" fill className="object-contain" />
    </div>
    <h2 className="text-xl font-semibold text-gray-700">Aucun message disponible</h2>
    <p className="text-gray-500 text-center max-w-md">
      Vous n'avez aucun message dans cette section pour le moment.
    </p>
    <NewMessageAlert />
  </div>
);
