"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/shared/loading";
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/trainings/id/questions");
  }, [router]);

  return (
    <div className="py-12">
      <Loading text="Redirection en cours..." />
    </div>
  );
}
