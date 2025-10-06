import { Suspense } from "react";
import { LessonList } from "../components/lesson-tab/lesson-list";
import { LessonListSkeleton } from "@/components/skeletons/lesson-list-skeleton";
import { LesssonContainer } from "../components/lesson-tab/lesson-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
export default function Page() {
  return (
    <Suspense fallback={<LessonListSkeleton />}>
      {/* <LesssonContainer /> */}
      {/* <LessonList /> */}
    </Suspense>
  );
}
