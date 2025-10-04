import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlanningSkeleton() {
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center flex-wrap gap-2.5">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex flex-col md:flex-row gap-5 p-5">
        <Card className="border flex-1">
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
