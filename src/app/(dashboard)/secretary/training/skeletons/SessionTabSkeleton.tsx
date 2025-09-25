import React from "react";

const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

export function SessionTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs header */}
      <div className="flex space-x-1 mb-6">
        <Skeleton height="2.5rem" width="120px" className="rounded-md" />
        <Skeleton height="2.5rem" width="120px" className="rounded-md" />
        <Skeleton height="2.5rem" width="120px" className="rounded-md" />
        <Skeleton height="2.5rem" width="120px" className="rounded-md" />
      </div>

      {/* Tab content */}
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton height="1.5rem" width="200px" />
        <div className="space-y-2">
          <Skeleton height="1rem" width="100%" />
          <Skeleton height="1rem" width="90%" />
          <Skeleton height="1rem" width="80%" />
          <Skeleton height="1rem" width="70%" />
        </div>
      </div>
    </div>
  );
}
