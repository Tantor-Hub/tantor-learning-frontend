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
import { BookOpen, ClipboardList, FileText, Upload, Download, Trash2, X } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setUploadProgress(0);

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener(
        "progress",
        (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        },
        false
      );

      // Handle successful upload
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            toast.success("Document ajouté avec succès");
            setSelectedFile(null);
            setUploadProgress(0);

            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = "";
            }

            // Refetch documents to update the list
            refetchDocuments();
            resolve();
          } catch (error) {
            toast.error("Erreur lors du traitement de la réponse");
            reject(error);
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            toast.error(errorData.message || `Erreur HTTP: ${xhr.status}`);
          } catch {
            toast.error(`Erreur HTTP: ${xhr.status}`);
          }
          reject(new Error(`HTTP error! status: ${xhr.status}`));
        }
        setIsUploading(false);
      });

      // Handle network errors
      xhr.addEventListener("error", () => {
        toast.error("Erreur réseau lors du téléchargement");
        setIsUploading(false);
        setUploadProgress(0);
        reject(new Error("Network error"));
      });

      // Handle aborted uploads
      xhr.addEventListener("abort", () => {
        toast.error("Téléchargement annulé");
        setIsUploading(false);
        setUploadProgress(0);
        reject(new Error("Upload aborted"));
      });

      // Prepare form data
      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("id_lesson", lessonId);
      formData.append("ispublish", "false");

      // Open and send request
      xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL}/lessondocument/create`);
      xhr.setRequestHeader("x-connexion-tantor", `Bearer ${token}`);
      xhr.send(formData);
    });
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

  const cancelUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
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
              <div className="flex gap-2">
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="max-w-xs"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.xls,.xlsx"
                  disabled={isUploading}
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

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{selectedFile?.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-gray-600 mt-2">
                  Téléchargement en cours... Veuillez patienter.
                </p>
              </div>
            )}

            {/* Selected File Preview (before upload) */}
            {selectedFile && !isUploading && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelUpload}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

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
      </Tabs>
    </div>
  );
}
