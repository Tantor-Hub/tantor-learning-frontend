"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";
import {
  useGetLessonByIdQuery,
  useGetLessonDocumentsQuery,
  useDeleteLessonDocumentMutation,
} from "@/lib/apis/instructor/instructor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ClipboardList, FileText, Upload, Download, Trash2 } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { ContentTab } from "./tab/content";
import { EvaluationTab } from "./tab/evalution";
import { DevoirTab } from "./tab/devoirs";
import { UploadDocumentModal } from "./upload-document-modal";
import { UpdateLessonDocument } from "./update-lesson-document";

export function LessonDetail() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const courseId = params.courseId as string;
  const router = useRouter();
  const token = useSelector(selectToken);

  const {
    data: lesson,
    isLoading: isLoadingLesson,
    error,
  } = useGetLessonByIdQuery({ lessonId }, { skip: !lessonId });

  const {
    data: lessonDocuments,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useGetLessonDocumentsQuery({ lessonId }, { skip: !lessonId });

  const [deleteLessonDocument] = useDeleteLessonDocumentMutation();

  const handleDeleteDocument = async (documentId: string, fileName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${fileName}" ?`)) {
      return;
    }

    let toastId: string | null = null;

    try {
      toastId = toast.loading("Suppression du document...");

      await deleteLessonDocument({ documentId }).unwrap();

      if (toastId) {
        toast.dismiss(toastId);
      }
      toast.success("Document supprimé avec succès");
    } catch (error: any) {
      if (toastId) {
        toast.dismiss(toastId);
      }
      const errorMessage = error?.data?.message || "Erreur lors de la suppression du document";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    }
  };

  if (isLoadingLesson) {
    return <Skeleton className="min-h-screen p-6" />;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <EmptyState
          icon="ExclamationTriangleIcon"
          title="Erreur de chargement"
          description="Une erreur s'est produite lors du chargement de la leçon."
        />
      </div>
    );
  }

  if (!lesson?.data) {
    return (
      <div>
        <Tabs defaultValue="contenu" className="w-full">
          <TabsList className="bg-white border font-semibold px-2.5 py-6 grid-cols-1 gap-4">
            <TabsTrigger value="contenu" className="p-5 px-2 md:px-5">
              Contenu
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="p-5 px-2 md:px-5">
              Évaluations
            </TabsTrigger>
            <TabsTrigger value="devoirs" className="p-5 px-2 md:px-5">
              Devoirs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="contenu">
            <ContentTab />
          </TabsContent>
          <TabsContent value="evaluations">
            <EvaluationTab />
          </TabsContent>
          <TabsContent value="devoirs">
            <DevoirTab />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              className="hover:cursor-pointer hover:text-primary"
              onClick={() => router.back()}
            >
              <ChevronLeft size={50} />
            </button>
            <div>
              <p className="text-2xl font-bold">{lesson.data.title}</p>
              <p className="text-muted-foreground">{lesson.data.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Créé le {new Date(lesson.data.createdAt).toLocaleDateString("fr-FR")}
            </div>
            <div className="text-sm text-muted-foreground">
              Modifié le {new Date(lesson.data.updatedAt).toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <Tabs defaultValue="contenu" className="w-full">
        <TabsContent value="contenu">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Contenu de la leçon</h3>
              </div>
              <UploadDocumentModal lessonId={lessonId} onSuccess={refetchDocuments} />
            </div>

            {isLoadingDocuments ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : documentsError ? (
              <EmptyState
                icon="ExclamationTriangleIcon"
                title="Erreur de chargement"
                description="Une erreur s'est produite lors du chargement des documents."
              />
            ) : lessonDocuments?.data?.lessondocuments?.length ? (
              <div className="space-y-4">
                {lessonDocuments.data.lessondocuments.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-8 h-8 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{doc.title}</h4>
                            <p className="text-muted-foreground mb-2">{doc.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge variant="secondary">{doc.type}</Badge>
                              <span>
                                Par {doc.creator.firstName} {doc.creator.lastName}
                              </span>
                              <span>•</span>
                              <span>{new Date(doc.createdAt).toLocaleDateString("fr-FR")}</span>
                              {doc.ispublish && (
                                <>
                                  <span>•</span>
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-600"
                                  >
                                    Publié
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.piece_jointe} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
                            </a>
                          </Button>
                          <UpdateLessonDocument documentId={doc.id} onSuccess={refetchDocuments} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id, doc.file_name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="DocumentIcon"
                title="Aucun document"
                description="Commencer à créer les contenu."
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
