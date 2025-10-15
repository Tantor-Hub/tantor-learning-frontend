"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GeneralInfoSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/GeneralInfoSkeleton";
import { CoursesSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/CoursesSkeleton";
import { EventsSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/EventsSkeleton";
import { DocumentsSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/DocumentsSkeleton";
import { PaymentSkeleton } from "@/app/(dashboard)/secretary/training/skeletons/PaymentSkeleton";
import { EditSessionModal } from "./edit-session-modal";
import { useDeleteSessionMutation } from "@/lib/apis/secretary/session-secretary-api";
import { toast } from "react-hot-toast";

const GeneralInfo = React.lazy(() => import("../session/GeneralInfo"));
const Courses = React.lazy(() => import("../session/Courses"));
const Events = React.lazy(() => import("../session/Events"));
const Documents = React.lazy(() => import("../session/Documents"));
const Payment = React.lazy(() => import("../session/payment"));

export default function SessionDetailsClient() {
  const router = useRouter();
  const params = useParams();
  const trainingId = params.id as string;
  const sessionId = params.sessionId as string;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteSession, { isLoading: isDeleting }] = useDeleteSessionMutation();

  const handleGoBack = () => {
    router.push(`/secretary/training/${trainingId}/sessions`);
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSession({ id: sessionId }).unwrap();
      toast.success("Session supprimée avec succès !");
      router.push(`/secretary/training/${trainingId}/sessions`);
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Erreur lors de la suppression de la session");
    }
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
              <div className="flex items-center gap-4">
                <Button onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer la session</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer la session ? Cette action est
                        irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="courses">Matières</TabsTrigger>
              <TabsTrigger value="events">Emploi du temps</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="payment">Paiement</TabsTrigger>
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

            <TabsContent value="payment" className="space-y-4 mt-6">
              <React.Suspense fallback={<PaymentSkeleton />}>
                <Payment />
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
