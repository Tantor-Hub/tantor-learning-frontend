import { Suspense } from "react";
import TrainingPageClient from "./components/TrainingPageClient";
import { TrainingListSkeleton } from "./skeletons/TrainingListSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<TrainingListSkeleton />}>
      <TrainingPageClient />
    </Suspense>
  );
}
