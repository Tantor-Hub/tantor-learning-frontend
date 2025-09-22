import { Metadata } from "next";
import { Suspense } from "react";
import { VerifyCodeForm } from "@/components/forms/verify-code-form";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";

export const metadata: Metadata = {
  title: "Vérifier le code",
};

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <VerifyCodeForm />
    </Suspense>
  );
}
