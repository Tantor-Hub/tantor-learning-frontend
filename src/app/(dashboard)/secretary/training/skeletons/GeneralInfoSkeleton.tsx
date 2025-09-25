import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

export function GeneralInfoSkeleton() {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton height="1.5rem" width="200px" />
        <div className="space-y-2">
          <Skeleton height="1rem" width="100%" />
          <Skeleton height="1rem" width="90%" />
          <Skeleton height="1rem" width="80%" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton height="1rem" width="80px" />
            <Skeleton height="1.25rem" width="120px" />
          </div>
          <div className="space-y-2">
            <Skeleton height="1rem" width="60px" />
            <Skeleton height="1.25rem" width="100px" />
          </div>
        </div>
      </div>
    </div>
  );
}
