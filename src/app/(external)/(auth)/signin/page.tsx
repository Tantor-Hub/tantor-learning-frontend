import { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/forms/signin-form";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";

export const metadata: Metadata = {
  title: "Se connecter",
};
export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignInForm />
    </Suspense>
  );
}
