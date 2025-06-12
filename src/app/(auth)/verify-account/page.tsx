import { Suspense } from "react";
import { VerifyAccount } from "@/components/forms/verify-account";
import { Loading } from "@/components/shared/loading";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-2xl text-primary">
          <Loading />
        </div>
      }
    >
      <VerifyAccount />
    </Suspense>
  );
}
