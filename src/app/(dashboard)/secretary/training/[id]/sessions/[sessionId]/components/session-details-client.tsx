"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralInfoSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/GeneralInfoSkeleton";
import { CoursesSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/CoursesSkeleton";
import { EventsSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/EventsSkeleton";
import { DocumentsSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/DocumentsSkeleton";
import { EditSessionModal } from "./edit-session-modal";

const GeneralInfo = React.lazy(() => import("../session/GeneralInfo"));
const Courses = React.lazy(() => import("../session/Courses"));
const Events = React.lazy(() => import("../session/Events"));
const Documents = React.lazy(() => import("../session/Documents"));

export default function SessionDetailsClient() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;
  const sessionId = params.sessionId as string;
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleGoBack = () => {
    router.push(`/secretary/training/${trainingId}/sessions`);
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux sessions
              </Button>
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Détails de la session</h1>
                  <p className="text-gray-600">Session ID: {sessionId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="courses">Cours</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-6">
              <React.Suspense fallback={<GeneralInfoSkeleton />}>
                <GeneralInfo />
              </React.Suspense>
            </TabsContent>

            <TabsContent value="courses" className="space-y-4 mt-6">
              <React.Suspense fallback={<CoursesSkeleton />}>
                <Courses sessionId={sessionId} />
              </React.Suspense>
            </TabsContent>

            <TabsContent value="events" className="space-y-4 mt-6">
              <React.Suspense fallback={<EventsSkeleton />}>
                <Events />
              </React.Suspense>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-6">
              <React.Suspense fallback={<DocumentsSkeleton />}>
                <Documents />
              </React.Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Session Modal */}
      <EditSessionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        sessionId={sessionId}
      />
    </div>
  );
}
