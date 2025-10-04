import { Skeleton } from "@/components/ui/skeleton";

export function MessageActionsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <Skeleton className="h-10 w-20" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Main message skeleton */}
      <div className="border border-border rounded-lg p-4 mt-4">
        <div className="mb-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Replies skeleton */}
      <div className="mt-6">
        <Skeleton className="h-6 w-32 mb-4" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border border-border rounded-lg p-4 mb-4">
            <div className="mb-2">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
