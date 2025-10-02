"use client";

import React, { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralInfoSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/GeneralInfoSkeleton";
import { CoursesSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/CoursesSkeleton";
import { EventsSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/EventsSkeleton";
import { DocumentsSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/DocumentsSkeleton";

const GeneralInfo = React.lazy(() => import("./GeneralInfo"));
const Courses = React.lazy(() => import("./Courses"));
const Events = React.lazy(() => import("./Events"));
const Documents = React.lazy(() => import("./Documents"));

export default function SessionTab() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [tabValue, setTabValue] = useState("general");

  return (
    <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">Informations</TabsTrigger>
        <TabsTrigger value="courses">Matières</TabsTrigger>
        <TabsTrigger value="events">Événements</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="payment">Paiement</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Suspense fallback={<GeneralInfoSkeleton />}>
          <GeneralInfo />
        </Suspense>
      </TabsContent>

      <TabsContent value="courses" className="space-y-4">
        <Suspense fallback={<CoursesSkeleton />}>
          <Courses sessionId={sessionId} />
        </Suspense>
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        <Suspense fallback={<EventsSkeleton />}>
          <Events />
        </Suspense>
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <Suspense fallback={<DocumentsSkeleton />}>
          <Documents />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
