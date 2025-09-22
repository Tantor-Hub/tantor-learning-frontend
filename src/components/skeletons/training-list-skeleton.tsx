import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Individual training card skeleton
const TrainingCardSkeleton = () => (
  <div className="border border-gray-200 rounded-[6px] shadow-sm max-w-md">
    {/* Header section with blue background */}
    <div className="p-5 bg-gray-100 flex flex-col gap-4">
      <Skeleton height="1.5rem" width="85%" />
      <Skeleton height="1rem" width="70%" />
    </div>

    {/* Content section */}
    <div className="p-10 pt-5 flex flex-col gap-4">
      {/* Description lines */}
      <div className="mt-4 mb-5 space-y-2">
        <Skeleton height="0.875rem" width="100%" />
        <Skeleton height="0.875rem" width="90%" />
        <Skeleton height="0.875rem" width="60%" />
      </div>

      {/* Info items with icons */}
      <div className="flex items-center gap-2.5">
        <Skeleton width="20px" height="20px" className="rounded" />
        <Skeleton height="1rem" width="40%" />
      </div>

      <div className="flex items-center gap-2.5">
        <Skeleton width="20px" height="20px" className="rounded" />
        <Skeleton height="1rem" width="35%" />
      </div>

      <div className="flex items-center gap-2.5">
        <Skeleton width="20px" height="20px" className="rounded" />
        <Skeleton height="1rem" width="45%" />
      </div>

      <div className="flex items-center gap-2.5">
        <Skeleton width="20px" height="20px" className="rounded" />
        <Skeleton height="1rem" width="30%" />
      </div>

      {/* Button skeleton */}
      <Skeleton height="2.5rem" width="100%" className="rounded-md mt-2" />
    </div>
  </div>
);

export function TrainingListSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Search and filter section */}
      <div className="flex flex-col sm:flex-row justify-between my-4 gap-5">
        {/* Search bar skeleton - looks like real search input */}
        <div className="flex items-center border border-gray-300 px-2.5 py-2 w-full sm:w-[50%] md:w-[40%] lg:w-[30%] rounded-md bg-white">
          <div className="w-5 h-5 bg-gray-300 rounded-sm flex-shrink-0"></div>
          <div className="ml-2 flex-1 py-1">
            <Skeleton className="h-4 w-48 bg-gray-100" />
          </div>
        </div>

        {/* Filter buttons skeleton - looks like real buttons */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md bg-white">
            <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
            <Skeleton className="h-4 w-12" />
          </div>
          {/* Optional: Add clear filters button skeleton */}
          <div className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md bg-white">
            <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      </div>

      {/* Results count skeleton */}
      <div className="mb-4">
        <Skeleton className="h-4 w-[200px]" />
      </div>

      {/* Training cards grid */}
      <div className="py-4 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
        {/* Generate 6 skeleton cards to simulate loading */}
        {Array.from({ length: 6 }, (_, index) => (
          <TrainingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
