import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MessageTabViewSkeleton() {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-10 w-20" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="py-4 px-2.5 bg-white border font-semibold">
          <TabsTrigger value="all" className="p-3.5">
            Tous
          </TabsTrigger>
          <TabsTrigger value="archives" className="p-3.5">
            Archives
          </TabsTrigger>
          <TabsTrigger value="deleted" className="p-3.5">
            Supprimés
          </TabsTrigger>
          <TabsTrigger value="send" className="p-3.5">
            Envoyés
          </TabsTrigger>
          <TabsTrigger value="received" className="p-3.5">
            Reçus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archives">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deleted">
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="send">
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="received">
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
