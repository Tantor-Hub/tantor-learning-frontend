import { Metadata } from "next";
import { Suspense } from "react";
import { VerifyAccountForm } from "@/components/forms/verify-account-form";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";

export const metadata: Metadata = {
  title: "Vérifier le compte",
};
export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <VerifyAccountForm />
    </Suspense>
  );
}
