import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlanningSkeleton() {
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <Card className="border flex-1 rounded p-4 shadow-none">
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex-[1] border flex flex-col gap-4 rounded p-4 overflow-y-auto">
          {/* Header */}
          <div className="pb-4 border-b">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Event Cards */}
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                {/* Header: Type Badge & Time */}
                <div className="flex justify-between items-start mb-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                {/* Title */}
                <Skeleton className="h-6 w-3/4 mb-2" />

                {/* Course Title */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-40" />
                </div>

                {/* Description */}
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-3" />

                {/* Created By */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
                  <Skeleton className="w-3.5 h-3.5" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
