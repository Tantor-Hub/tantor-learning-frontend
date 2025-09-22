import { Skeleton } from "../ui/skeleton";

export function AuthSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-4 text-center">
        <Skeleton className="h-7 w-32 mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="space-y-4">
        <div className="grid gap-4">
          {/* Email Field Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Password Field Skeleton */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Submit Button Skeleton */}
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      {/* Divider Skeleton */}
      <div className="relative text-center">
        <div className="absolute inset-0 top-1/2 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <Skeleton className="h-4 w-6 bg-background" />
        </div>
      </div>

      {/* Google Sign In Button Skeleton */}
      <Skeleton className="h-12 w-full" />

      {/* Sign Up Link Skeleton */}
      <div className="text-center space-y-1">
        <Skeleton className="h-4 w-56 mx-auto" />
      </div>
    </div>
  );
}
