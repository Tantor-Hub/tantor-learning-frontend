import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NewMessageSkeleton() {
  return (
    <Button disabled variant="outline">
      <Plus className="mr-2 h-4 w-4" />
      <Skeleton className="h-4 w-24" />
    </Button>
  );
}
