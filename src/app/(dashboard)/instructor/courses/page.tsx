import { Suspense } from "react";
import { CourseList } from "./course-list";
import { CourseListSkeleton } from "@/components/skeletons/course-list-skeleton";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<CourseListSkeleton />}>
        <CourseList />
      </Suspense>
    </div>
  );
}
