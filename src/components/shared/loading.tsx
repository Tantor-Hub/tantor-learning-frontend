import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium text-gray-700">Chargement en cours...</p>
    </div>
  );
}
