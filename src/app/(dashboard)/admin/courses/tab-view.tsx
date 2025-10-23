"use client";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseTab } from "./course-tab";
import { ModuleFormationTab } from "./module-formation-tab";
import { ModuleFormationSkeleton } from "@/components/skeletons/module-formation-skeleton";

export function TabsView() {
  return (
    <Tabs defaultValue="courses" className="w-full border p-4">
      <div className="flex items-center justify-between">
        <TabsList className="bg-transparent border-none font-semibold">
          <TabsTrigger value="courses" className="p-3.5 bg-none">
            Matières
          </TabsTrigger>
          <TabsTrigger value="moduleFormation" className="p-3.5 bg-none">
            Module Formation
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="courses">
        <div className="overflow-x-auto my-4 rounded-md bg-white">
          <div>
            <div className="min-w-[1000px]">
              <CourseTab />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="moduleFormation">
        <Suspense fallback={<ModuleFormationSkeleton />}>
          <ModuleFormationTab />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
