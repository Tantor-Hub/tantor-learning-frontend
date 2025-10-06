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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { ContentTab } from "./tab/content";
import { EvaluationTab } from "./tab/evalution";
import { DevoirTab } from "./tab/devoirs";

export function LessonDetail() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const courseId = params.courseId as string;
  const router = useRouter();
  const token = useSelector(selectToken);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    setIsUploading(true);
    let toastId: string | null = null;

    try {
      toastId = toast.loading("Téléchargement du document...");

      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("id_lesson", lessonId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/lessondocument/create`, {
        method: "POST",
        headers: {
          "x-connexion-tantor": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (toastId) {
        toast.dismiss(toastId);
      }
      toast.success("Document ajouté avec succès");
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      // Refetch documents to update the list
      refetchDocuments();
    } catch (error: any) {
      if (toastId) {
        toast.dismiss(toastId);
      }
      const errorMessage = error.message || "Erreur lors de l'ajout du document";
      toast.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="min-h-screen p-6">
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
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Contenu de la leçon</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="max-w-xs"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.xls,.xlsx"
                />
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? "Téléchargement..." : "+ Contenu"}
                  <Upload className="w-4 h-4 ml-2" />
                </Button>
              </div>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-semibold">{doc.file_name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge variant="secondary">{doc.type}</Badge>
                              <span>
                                Par {doc.creator.firstName} {doc.creator.lastName}
                              </span>
                              <span>•</span>
                              <span>{new Date(doc.createdAt).toLocaleDateString("fr-FR")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.piece_jointe} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
                            </a>
                          </Button>
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

        <TabsContent value="evaluations">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Quiz (Évaluations)</h3>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                + Évaluation
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Quiz 1: Bases de la Programmation</h4>
                <p className="text-gray-600">
                  10 questions à choix multiples. Durée: 20 minutes. Score moyen: 85%.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Exercice: Algorithmes Simples</h4>
                <p className="text-gray-600">
                  Résoudre 5 problèmes algorithmiques de base. Note maximale: 20 points.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Test Final: Programmation Avancée</h4>
                <p className="text-gray-600">
                  Évaluation complète avec code et questions théoriques. Durée: 1 heure.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="devoirs">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Devoirs</h3>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                + Devoir
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Projet 1: Application Console</h4>
                <p className="text-gray-600">
                  Développer une application console en Python pour gérer une liste de tâches. Date
                  limite: 15 mai.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Devoir Maison: Algorithmes de Tri</h4>
                <p className="text-gray-600">
                  Implémenter et comparer différents algorithmes de tri. Rapport requis. Date
                  limite: 20 mai.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Tâche: Révision des Concepts</h4>
                <p className="text-gray-600">
                  Réviser les concepts de base et préparer des questions pour la prochaine séance.
                  Soumission: 10 mai.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
