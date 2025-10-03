"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/auth-slice";
import {
  useGetLessonDocumentsQuery,
  useDeleteLessonDocumentMutation,
  useUpdateLessonDocumentMutation,
} from "@/lib/apis/instructor/instructor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Upload, Download, Trash2, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";

export function ContentTab() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const token = useSelector(selectToken);
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [editingDocument, setEditingDocument] = useState<any>(null);

  const {
    data: lessonDocuments,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useGetLessonDocumentsQuery({ lessonId }, { skip: !lessonId });

  const [deleteLessonDocument] = useDeleteLessonDocumentMutation();

  const handleFileUpload = () => {
    if (!title.trim()) {
      toast.error("Veuillez saisir un titre");
      return;
    }

    if (!description.trim()) {
      toast.error("Veuillez saisir une description");
      return;
    }

    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const toastId = toast.loading(
      mode === "create" ? "Téléchargement du document... 0%" : "Mise à jour du document... 0%"
    );

    const formData = new FormData();
    if (selectedFile) {
      formData.append("document", selectedFile);
    }
    formData.append("id_lesson", lessonId);
    formData.append("title", title);
    formData.append("description", description);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
        toast.loading(
          `${mode === "create" ? "Téléchargement" : "Mise à jour"} du document... ${percent}%`,
          { id: toastId }
        );
      }
    };

    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadProgress(100);
          toast.success(
            mode === "create" ? "Document ajouté avec succès" : "Document mis à jour avec succès",
            { id: toastId }
          );
          setSelectedFile(null);
          setTitle("");
          setDescription("");
          setUploadProgress(0);
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = "";
          }
          setIsDialogOpen(false);
          refetchDocuments();
        } else {
          setUploadProgress(0);
          throw new Error(result.message || `HTTP error! status: ${xhr.status}`);
        }
      } catch (error: any) {
        setUploadProgress(0);
        const errorMessage =
          error.message ||
          (mode === "create"
            ? "Erreur lors de l'ajout du document"
            : "Erreur lors de la mise à jour du document");
        toast.error(errorMessage, { id: toastId });
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    };

    xhr.onerror = () => {
      toast.error(
        mode === "create"
          ? "Erreur lors de l'ajout du document"
          : "Erreur lors de la mise à jour du document",
        { id: toastId }
      );
      console.error("Upload error: Network error");
      setIsUploading(false);
    };

    if (mode === "create") {
      xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL}/lessondocument/create`);
    } else if (mode === "update" && editingDocument) {
      xhr.open(
        "PATCH",
        `${process.env.NEXT_PUBLIC_BASE_URL}/lessondocument/update/${editingDocument.id}`
      );
    }
    xhr.setRequestHeader("x-connexion-tantor", `Bearer ${token}`);
    xhr.send(formData);
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

  const handleEditDocument = (doc: any) => {
    setMode("update");
    setEditingDocument(doc);
    setTitle(doc.title || "");
    setDescription(doc.description || "");
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setMode("create");
    setEditingDocument(null);
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="mr-4">
            Retour
          </Button>
          <BookOpen className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Contenu de la leçon</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              + Contenu
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Ajouter un document" : "Modifier le document"}
              </DialogTitle>
            </DialogHeader>
            {isUploading && (
              <div className="mb-4">
                <Progress value={uploadProgress} />
                <p className="text-sm text-gray-600 mt-2">Téléchargement... {uploadProgress}%</p>
              </div>
            )}
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Titre du document"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
              />
              <Input
                type="text"
                placeholder="Description du document"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
              />
              <Input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.xls,.xlsx"
                disabled={isUploading}
              />
              <Button
                onClick={handleFileUpload}
                disabled={
                  (mode === "create" && !selectedFile) ||
                  !title.trim() ||
                  !description.trim() ||
                  isUploading
                }
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isUploading
                  ? mode === "create"
                    ? "Téléchargement..."
                    : "Mise à jour..."
                  : mode === "create"
                    ? "Ajouter le document"
                    : "Modifier le document"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                      onClick={() => handleEditDocument(doc)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Modifier
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
