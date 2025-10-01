import { Suspense } from "react";
import { LessonDetail } from "./lesson-detail";
import { LessonDetailSkeleton } from "@/components/skeletons/lesson-detail-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<LessonDetailSkeleton />}>
      <LessonDetail />
    </Suspense>
  );
}
