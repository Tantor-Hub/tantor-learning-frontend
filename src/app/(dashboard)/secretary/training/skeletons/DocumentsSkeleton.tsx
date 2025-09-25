import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Individual document item skeleton
const DocumentItemSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton width="32px" height="32px" className="rounded" />
      <div className="space-y-2 flex-1">
        <Skeleton height="1.25rem" width="60%" />
        <Skeleton height="1rem" width="40%" />
      </div>
      <Skeleton width="80px" height="24px" className="rounded" />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton width="20px" height="20px" className="rounded" />
      <Skeleton height="1rem" width="50%" />
      <Skeleton width="20px" height="20px" className="rounded ml-4" />
      <Skeleton height="1rem" width="30%" />
    </div>
  </div>
);

export function DocumentsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, index) => (
        <DocumentItemSkeleton key={index} />
      ))}
    </div>
  );
}
