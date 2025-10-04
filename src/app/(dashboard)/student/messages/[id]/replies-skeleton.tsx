import { Skeleton } from "@/components/ui/skeleton";

export function RepliesSkeleton() {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Réponses</h3>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border border-border rounded-lg p-4 mb-4">
          <div className="mb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </div>
      ))}
    </div>
  );
}
