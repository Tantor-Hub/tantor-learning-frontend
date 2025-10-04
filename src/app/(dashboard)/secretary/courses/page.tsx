import { Suspense } from "react";
import { CourseTable } from "./course-table";
import { CourseTableSkeleton } from "./course-table-skeleton";

export default function Page() {
  return (
    <div>
      <div className="overflow-x-auto p-8 my-5 border rounded-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-primary text-xl font-semibold mb-3">Liste de toute les matières</h2>
          </div>
        </div>
        <div>
          <div className="min-w-[1000px]">
            <Suspense fallback={<CourseTableSkeleton />}>
              <CourseTable />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
