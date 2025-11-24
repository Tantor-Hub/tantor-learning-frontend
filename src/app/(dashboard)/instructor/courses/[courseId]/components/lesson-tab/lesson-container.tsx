"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LessonList } from "./lesson-list";
import { Evaluations } from "./evaluations";

export function LesssonContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "lessons";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
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
