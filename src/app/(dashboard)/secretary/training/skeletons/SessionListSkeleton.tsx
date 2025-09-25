import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Individual session card skeleton
const SessionCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton height="1.5rem" width="80%" />
        <Skeleton height="1rem" width="60%" />
      </div>
      <Skeleton width="100px" height="32px" className="rounded-md" />
    </div>

    <div className="space-y-2">
      <Skeleton height="1rem" width="100%" />
      <Skeleton height="1rem" width="85%" />
    </div>

    <div className="flex items-center gap-4">
      <Skeleton width="20px" height="20px" className="rounded" />
      <Skeleton height="1rem" width="40%" />
      <Skeleton width="20px" height="20px" className="rounded ml-4" />
      <Skeleton height="1rem" width="30%" />
    </div>
  </div>
);

export function SessionListSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header section */}
      <div className="mb-6">
        <Skeleton height="2rem" width="300px" className="mb-2" />
        <Skeleton height="1rem" width="200px" />
      </div>

      {/* Session cards grid */}
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SessionCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
