import { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/components/forms/signup-form";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";

export const metadata: Metadata = {
  title: "S'inscrire",
};

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignUpForm />
    </Suspense>
  );
}
