import { Metadata } from "next";
import { Suspense } from "react";
import { Reset } from "@/components/forms/reset";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
};

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <Reset />
    </Suspense>
  );
}
