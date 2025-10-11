"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { LessonsTab } from "./tab/lessons";
import { EvaluationsTab } from "./tab/evalutations";
export default function Page() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Button onClick={() => router.back()}>
        <ChevronLeft /> Retour
      </Button>
      <Tabs>
        <TabsList defaultValue="lessons">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="documents">Evaluations</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">
          <LessonsTab />
        </TabsContent>
        <TabsContent value="documents">
          <EvaluationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
