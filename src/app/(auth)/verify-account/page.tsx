import { Suspense } from "react";
import { VerifyAccount } from "@/components/forms/verify-account";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-2xl text-primary">
          Chargement en cours...
        </div>
      }
    >
      <VerifyAccount />
    </Suspense>
  );
}
