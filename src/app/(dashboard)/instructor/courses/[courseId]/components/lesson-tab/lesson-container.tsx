import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LessonList } from "./lesson-list";
import { Evaluations } from "./evaluations";

export function LesssonContainer() {
  return (
    <Tabs defaultValue="lessons" className="w-full">
      <TabsList className="w-full border-b">
        <TabsTrigger value="lessons">Leçons</TabsTrigger>
        <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
      </TabsList>
      <TabsContent value="lessons" className="mt-4">
        <LessonList />
      </TabsContent>
      <TabsContent value="evaluations" className="mt-4">
        <Evaluations />
      </TabsContent>
    </Tabs>
  );
}
