import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

export function SessionDetailsSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton height="2.5rem" width="120px" className="rounded-md" />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton height="2.5rem" width="400px" className="mb-2" />
                  <Skeleton height="1.25rem" width="250px" />
                </div>
                <Skeleton height="2.5rem" width="100px" className="rounded-md" />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            {/* Tabs header */}
            <div className="flex space-x-1">
              <Skeleton height="2.5rem" width="120px" className="rounded-md" />
              <Skeleton height="2.5rem" width="100px" className="rounded-md" />
              <Skeleton height="2.5rem" width="100px" className="rounded-md" />
              <Skeleton height="2.5rem" width="120px" className="rounded-md" />
            </div>

            {/* Tab content */}
            <div className="space-y-4">
              {/* General Info Tab */}
              <div className="border rounded-lg p-6 space-y-4">
                <Skeleton height="1.5rem" width="150px" />
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
                <div className="space-y-2">
                  <Skeleton height="1rem" width="100px" />
                  <Skeleton height="1rem" width="100%" />
                  <Skeleton height="1rem" width="90%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
