import { Suspense } from "react";
import { VerifyCode } from "@/components/forms/verify-code";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-2xl text-primary">
          Chargement en cours...
        </div>
      }
    >
      <VerifyCode />
    </Suspense>
  );
}
