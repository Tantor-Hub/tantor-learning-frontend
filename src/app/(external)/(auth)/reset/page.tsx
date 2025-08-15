import { Suspense } from "react";
import { Reset } from "@/components/forms/reset";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-2xl text-primary">
          Chargement en cours...
        </div>
      }
    >
      <Reset />
    </Suspense>
  );
}
