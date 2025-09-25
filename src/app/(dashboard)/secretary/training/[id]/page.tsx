import { Suspense } from "react";
import TrainingDetailsClient from "./components/TrainingDetailsClient";
import { TrainingDetailsSkeleton } from "../skeletons/TrainingDetailsSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<TrainingDetailsSkeleton />}>
      <TrainingDetailsClient />
    </Suspense>
  );
}
