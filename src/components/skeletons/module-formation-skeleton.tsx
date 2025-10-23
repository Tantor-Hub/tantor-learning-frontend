import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Individual module item skeleton
const ModuleItemSkeleton = () => (
  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
    <div className="flex-1">
      <Skeleton height="1rem" width="80%" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton height="2rem" width="100px" className="rounded-md" />
      <Skeleton height="2rem" width="80px" className="rounded-md" />
    </div>
  </div>
);

export function ModuleFormationSkeleton() {
  return (
    <div className="overflow-x-auto my-4 rounded-md bg-white border">
      <div className="min-w-[1000px]">
        <div className="p-6">
          <Skeleton height="1.5rem" width="250px" className="mb-4" />
          <div className="space-y-4">
            {/* Generate 4 skeleton items to simulate loading */}
            {Array.from({ length: 4 }, (_, index) => (
              <ModuleItemSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
