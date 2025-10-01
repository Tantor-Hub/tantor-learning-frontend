import { Suspense } from "react";
import { LessonList } from "../components/lesson-list";
import { LessonListSkeleton } from "@/components/skeletons/lesson-list-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<LessonListSkeleton />}>
      <LessonList />
    </Suspense>
  );
}
