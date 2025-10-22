import { Suspense } from "react";
import { CourseTable } from "./course-table";
import { CourseTableSkeleton } from "./course-table-skeleton";

export default function Page() {
  return (
    <div>
      <div className="p-8 my-5 border rounded-md">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-primary text-xl font-semibold">Liste de toute les matières</h2>
          </div>
        </div>
        <div>
          <Suspense fallback={<CourseTableSkeleton />}>
            <CourseTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
