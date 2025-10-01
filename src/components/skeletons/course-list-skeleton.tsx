import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Individual course card skeleton
const CourseCardSkeleton = () => (
  <div className="border border-blue-200 rounded-lg shadow-sm bg-white">
    <div className="p-2.5">
      {/* Video placeholder skeleton */}
      <Skeleton height="110px" width="100%" className="rounded-md" />

      {/* Status and participants row */}
      <div className="flex justify-between mt-2.5">
        <Skeleton height="1.5rem" width="5rem" className="rounded-xl" />
        <div className="flex items-center gap-1">
          <Skeleton width="14px" height="14px" className="rounded" />
          <Skeleton height="0.75rem" width="4rem" />
        </div>
      </div>
    </div>

    {/* Course info section */}
    <div className="px-4 py-3 space-y-2">
      {/* Course title */}
      <Skeleton height="1rem" width="90%" />

      {/* Training session info */}
      <div className="space-y-1">
        <Skeleton height="0.75rem" width="80%" />
        <Skeleton height="0.75rem" width="60%" />
      </div>

      {/* Instructor info */}
      <div className="flex items-center gap-2">
        <Skeleton width="28px" height="28px" className="rounded-md" />
        <div className="flex flex-col gap-1">
          <Skeleton height="0.875rem" width="5rem" />
          <Skeleton height="0.625rem" width="3.5rem" />
        </div>
      </div>
    </div>
  </div>
);

export function CourseListSkeleton() {
  return (
    <div className="py-5 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-5">
      {/* Generate 10 skeleton cards to simulate loading */}
      {Array.from({ length: 10 }, (_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
