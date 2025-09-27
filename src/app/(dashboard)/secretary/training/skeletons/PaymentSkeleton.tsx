import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Payment method option skeleton
const PaymentMethodSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton width="20px" height="20px" className="rounded" />
      <div className="space-y-2 flex-1">
        <Skeleton height="1.25rem" width="60%" />
        <Skeleton height="1rem" width="40%" />
      </div>
      <Skeleton width="60px" height="24px" className="rounded-full" />
    </div>
  </div>
);

// Card payment form skeleton
const CardPaymentSkeleton = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <Skeleton height="1.5rem" width="200px" />
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton height="1rem" width="80px" />
        <Skeleton height="2.5rem" width="100%" />
      </div>
      <div className="space-y-2">
        <Skeleton height="1rem" width="100px" />
        <Skeleton height="2.5rem" width="100%" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton height="1rem" width="120px" />
      <Skeleton height="2.5rem" width="100%" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Skeleton height="1rem" width="60px" />
        <Skeleton height="2.5rem" width="100%" />
      </div>
      <div className="space-y-2">
        <Skeleton height="1rem" width="60px" />
        <Skeleton height="2.5rem" width="100%" />
      </div>
      <div className="space-y-2">
        <Skeleton height="1rem" width="80px" />
        <Skeleton height="2.5rem" width="100%" />
      </div>
    </div>
  </div>
);

// CPF input skeleton
const CPFSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="space-y-2">
      <Skeleton height="1rem" width="100px" />
      <Skeleton height="2.5rem" width="100%" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton width="20px" height="20px" className="rounded" />
      <Skeleton height="1rem" width="200px" />
    </div>
  </div>
);

// Session link skeleton
const SessionLinkSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="space-y-2">
      <Skeleton height="1.25rem" width="150px" />
      <Skeleton height="1rem" width="80%" />
    </div>
    <div className="flex items-center gap-3">
      <Skeleton width="20px" height="20px" className="rounded" />
      <Skeleton height="1rem" width="60%" />
    </div>
    <Skeleton height="2.5rem" width="120px" className="rounded" />
  </div>
);

export function PaymentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Payment Methods Section */}
      <div className="space-y-4">
        <Skeleton height="1.5rem" width="200px" />
        <div className="space-y-3">
          {Array.from({ length: 2 }, (_, index) => (
            <PaymentMethodSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Card Payment Form */}
      <CardPaymentSkeleton />

      {/* CPF Section */}
      <CPFSkeleton />

      {/* Session Link Section */}
      <SessionLinkSkeleton />

      {/* Payment Summary */}
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton height="1.5rem" width="180px" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton height="1rem" width="100px" />
            <Skeleton height="1rem" width="80px" />
          </div>
          <div className="flex justify-between">
            <Skeleton height="1rem" width="80px" />
            <Skeleton height="1rem" width="60px" />
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <Skeleton height="1.25rem" width="120px" />
              <Skeleton height="1.25rem" width="100px" />
            </div>
          </div>
        </div>
        <Skeleton height="3rem" width="100%" className="rounded" />
      </div>
    </div>
  );
}
