import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

export function LessonDetailSkeleton() {
  return (
    <div className="min-h-screen p-6">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Back button skeleton */}
            <Skeleton width="50px" height="50px" className="rounded" />
            <div className="space-y-2">
              {/* Lesson title skeleton */}
              <Skeleton height="2rem" width="25rem" />
              {/* Lesson description skeleton */}
              <Skeleton height="1.25rem" width="35rem" />
            </div>
          </div>
          <div className="text-right space-y-2">
            {/* Date info skeletons */}
            <Skeleton height="1rem" width="10rem" />
            <Skeleton height="1rem" width="10rem" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        {/* Tabs list skeleton */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex gap-4">
            <Skeleton height="3rem" width="8rem" className="rounded-md" />
            <Skeleton height="3rem" width="10rem" className="rounded-md" />
          </div>
        </div>

        {/* Tab content skeleton */}
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-4">
            {/* Content area skeleton */}
            <Skeleton height="2rem" width="15rem" />
            <div className="space-y-3">
              <Skeleton height="1.5rem" width="100%" />
              <Skeleton height="1.5rem" width="95%" />
              <Skeleton height="1.5rem" width="90%" />
              <Skeleton height="1.5rem" width="85%" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-3 mt-6">
              <Skeleton height="2.5rem" width="10rem" className="rounded-md" />
              <Skeleton height="2.5rem" width="8rem" className="rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
