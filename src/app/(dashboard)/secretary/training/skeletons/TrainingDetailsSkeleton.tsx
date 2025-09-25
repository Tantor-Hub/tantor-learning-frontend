import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

export function TrainingDetailsSkeleton() {
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
                  <Skeleton height="2.5rem" width="300px" className="mb-2" />
                  <Skeleton height="1.25rem" width="200px" />
                </div>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left column - Tabs content */}
            <div className="md:col-span-2">
              {/* Tabs header */}
              <div className="flex space-x-1 mb-6">
                <Skeleton height="2.5rem" width="120px" className="rounded-md" />
                <Skeleton height="2.5rem" width="100px" className="rounded-md" />
                <Skeleton height="2.5rem" width="100px" className="rounded-md" />
              </div>

              {/* Tab content */}
              <div className="space-y-4">
                {/* Card content */}
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
            </div>

            {/* Right column - Summary */}
            <div>
              <div className="border rounded-lg p-6 space-y-4">
                <Skeleton height="1.5rem" width="100px" />

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton height="1rem" width="40px" />
                    <Skeleton height="1.5rem" width="60px" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton height="1rem" width="60px" />
                    <Skeleton height="1rem" width="20px" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton height="1rem" width="80px" />
                    <Skeleton height="1rem" width="50px" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton height="1rem" width="50px" />
                    <Skeleton height="1rem" width="60px" />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Skeleton height="0.875rem" width="60px" />
                  <Skeleton height="1rem" width="100px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
