import { Suspense } from "react";
import { CourseDetail } from "./course-detail";
import { CourseDetailSkeleton } from "@/components/skeletons/course-detail-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<CourseDetailSkeleton />}>
      <CourseDetail />
    </Suspense>
  );
}
