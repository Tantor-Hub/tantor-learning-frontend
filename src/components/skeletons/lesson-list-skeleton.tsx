import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Individual lesson card skeleton
const LessonCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        {/* Order and status row */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton height="1rem" width="2rem" />
          <Skeleton height="1rem" width="4rem" />
        </div>

        {/* Lesson title */}
        <Skeleton height="1.5rem" width="80%" className="mb-2" />

        {/* Lesson description */}
        <div className="space-y-1 mb-4">
          <Skeleton height="1rem" width="100%" />
          <Skeleton height="1rem" width="90%" />
          <Skeleton height="1rem" width="70%" />
        </div>
      </div>
    </div>

    {/* Bottom row with duration, type, and date */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Skeleton width="16px" height="16px" className="rounded" />
          <Skeleton height="1rem" width="3rem" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton width="16px" height="16px" className="rounded" />
          <Skeleton height="1rem" width="2.5rem" />
        </div>
      </div>
      <Skeleton height="0.75rem" width="5rem" />
    </div>
  </div>
);

export function LessonListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Static header - no skeleton needed */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leçons</h2>
          <p className="text-gray-600">Gérez les leçons de votre cours</p>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton height="2.5rem" width="10rem" className="rounded-md" />
        </div>
      </div>

      {/* Lessons grid skeleton - only dynamic content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generate 6 skeleton cards to simulate loading */}
        {Array.from({ length: 6 }, (_, index) => (
          <LessonCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
