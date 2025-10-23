import { Suspense } from "react";
import { PlanningClient } from "./planning-client";
import { PlanningSkeleton } from "./planning-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<PlanningSkeleton />}>
      <PlanningClient />
    </Suspense>
  );
}
