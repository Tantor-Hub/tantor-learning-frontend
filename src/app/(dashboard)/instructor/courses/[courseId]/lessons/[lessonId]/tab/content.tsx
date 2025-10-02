"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";
import {
  useGetLessonDocumentsQuery,
  useDeleteLessonDocumentMutation,
} from "@/lib/apis/instructor/instructor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Upload, Download, Trash2, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";

export function ContentTab() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const token = useSelector(selectToken);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
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
          description="Commencez à créer le contenu de cette leçon en ajoutant des documents."
        />
      )}
    </div>
  );
}
