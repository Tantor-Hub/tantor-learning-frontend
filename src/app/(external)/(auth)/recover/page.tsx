import { Metadata } from "next";
import { Suspense } from "react";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";
import { RecoverForm } from "@/components/forms/recover-form";

export const metadata: Metadata = {
  title: "Récupérer le compte",
};

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <RecoverForm />
    </Suspense>
  );
}
