import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Individual event item skeleton
const EventItemSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton height="1.25rem" width="70%" />
        <Skeleton height="1rem" width="50%" />
      </div>
      <Skeleton width="60px" height="24px" className="rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton height="0.875rem" width="100%" />
      <Skeleton height="0.875rem" width="85%" />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton width="20px" height="20px" className="rounded" />
      <Skeleton height="1rem" width="30%" />
      <Skeleton width="20px" height="20px" className="rounded ml-4" />
      <Skeleton height="1rem" width="40%" />
    </div>
  </div>
);

export function EventsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }, (_, index) => (
        <EventItemSkeleton key={index} />
      ))}
    </div>
  );
}
