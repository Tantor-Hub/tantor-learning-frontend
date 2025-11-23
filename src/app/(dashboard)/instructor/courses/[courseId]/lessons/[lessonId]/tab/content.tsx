"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Upload, Download, Trash2, BookOpen, AlertCircle, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ContentTab() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const token = useSelector(selectToken);
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublish, setIsPublish] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [uploadXHR, setUploadXHR] = useState<XMLHttpRequest | null>(null);

  const {
    data: lessonDocuments,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useGetLessonDocumentsQuery({ lessonId }, { skip: !lessonId });

  const [deleteLessonDocument] = useDeleteLessonDocumentMutation();

  const cancelUpload = () => {
    if (uploadXHR) {
      uploadXHR.abort();
      setIsUploading(false);
      setUploadProgress(0);
      toast.error("Téléchargement annulé");
    }
  };

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

    // Check file size and warn user for very large files
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024 * 1024) {
      // 10GB warning
      const fileSizeGB = (selectedFile.size / (1024 * 1024 * 1024)).toFixed(2);
      toast.loading(
        `Fichier très volumineux (${fileSizeGB}GB). Cela peut prendre plusieurs minutes...`,
        {
          duration: 5000,
        }
      );
    }

    setIsUploading(true);
    setUploadProgress(0);
    const toastId = toast.loading(
      mode === "create" ? "Téléchargement du document... 0%" : "Mise à jour du document... 0%"
    );

    const formData = new FormData();
    if (selectedFile) {
      // FIXED: Ensure the field name is exactly "piece_jointe"
      formData.append("piece_jointe", selectedFile);
    }
    formData.append("id_lesson", lessonId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ispublish", isPublish.toString());

    const xhr = new XMLHttpRequest();
    setUploadXHR(xhr);

    // CRITICAL: Set extended timeout for large files (15 minutes for 100GB files)
    xhr.timeout = 900000; // 15 minutes in milliseconds

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
        toast.loading(
          `${mode === "create" ? "Téléchargement" : "Mise à jour"} du document... ${percent}%`,
          { id: toastId }
        );

        // Force UI update
        setUploadProgress((prev) => (percent !== prev ? percent : prev));
      } else {
        // Fallback progress calculation
        if (selectedFile && event.loaded > 0) {
          const estimatedPercent = Math.round((event.loaded / selectedFile.size) * 100);
          setUploadProgress(Math.min(estimatedPercent, 99));
        }
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
          setIsPublish(false);
          setUploadProgress(0);
          setUploadXHR(null);

          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = "";
          }
          setIsDialogOpen(false);
          refetchDocuments();
        } else {
          setUploadProgress(0);
          setUploadXHR(null);
          throw new Error(result.message || `HTTP error! status: ${xhr.status}`);
        }
      } catch (error: any) {
        setUploadProgress(0);
        setUploadXHR(null);
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
          ? "Erreur réseau lors de l'ajout du document"
          : "Erreur réseau lors de la mise à jour du document",
        { id: toastId }
      );
      console.error("Upload error: Network error");
      setIsUploading(false);
      setUploadProgress(0);
      setUploadXHR(null);
    };

    xhr.ontimeout = () => {
      toast.error(
        "Le téléchargement a pris trop de temps. Veuillez réessayer avec un fichier plus petit ou vérifier votre connexion.",
        { id: toastId, duration: 6000 }
      );
      console.error("Upload error: Timeout");
      setIsUploading(false);
      setUploadProgress(0);
      setUploadXHR(null);
    };

    xhr.onabort = () => {
      toast.dismiss(toastId);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadXHR(null);
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
    setIsPublish(!!doc.ispublish);
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setMode("create");
    setEditingDocument(null);
    setTitle("");
    setDescription("");
    setIsPublish(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setIsDialogOpen(true);
  };

  const getFileSizeWarning = () => {
    if (!selectedFile) return null;
    const sizeMB = selectedFile.size / (1024 * 1024);
    const sizeGB = selectedFile.size / (1024 * 1024 * 1024);

    if (sizeGB > 100) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fichier trop volumineux ({sizeGB.toFixed(2)}GB). Taille maximale: 100GB.
          </AlertDescription>
        </Alert>
      );
    } else if (sizeGB > 10) {
      return (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fichier très volumineux ({sizeGB.toFixed(2)}GB). Le téléchargement peut prendre beaucoup
            de temps.
          </AlertDescription>
        </Alert>
      );
    } else if (sizeMB > 100) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fichier volumineux ({sizeMB.toFixed(2)}MB). Le téléchargement peut prendre plusieurs
            minutes.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  const getFileName = () => {
    if (selectedFile) {
      return selectedFile.name;
    }
    if (mode === "update" && editingDocument) {
      return editingDocument.file_name || "Fichier existant";
    }
    return "Aucun fichier sélectionné";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    } else if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }
    return bytes + " bytes";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Retour
          </Button>
          <BookOpen className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Contenu de la leçon</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreateDialog}>
              <Upload className="w-4 h-4 mr-2" />
              Ajouter un document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-[90vw] sm:w-full">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{mode === "create" ? "Ajouter un document" : "Modifier le document"}</span>
                {isUploading && (
                  <Button variant="ghost" size="sm" onClick={cancelUpload} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>

            {isUploading && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progression du téléchargement</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {uploadProgress < 100
                    ? "Ne fermez pas cette fenêtre pendant le téléchargement"
                    : "Finalisation..."}
                </p>
              </div>
            )}

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre du document *</label>
                <Input
                  type="text"
                  placeholder="Entrez le titre du document"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Décrivez le contenu de ce document"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="publish-mode"
                  checked={isPublish}
                  onCheckedChange={setIsPublish}
                  disabled={isUploading}
                />
                <Label htmlFor="publish-mode" className="text-sm font-medium">
                  Publier immédiatement
                </Label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {mode === "create" ? "Sélectionner un fichier *" : "Nouveau fichier (optionnel)"}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    // Remove accept attribute to allow any file type as per API
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                    name="piece_jointe" // FIXED: Set the name attribute to match the expected field name
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          Cliquez pour parcourir ou glissez-déposez un fichier
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{getFileName()}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Tous les types de fichiers sont acceptés
                        </p>
                        <p className="text-xs text-muted-foreground">Taille maximale: 100GB</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {selectedFile && (
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium truncate flex-1">
                        {selectedFile.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                </div>
              )}

              {getFileSizeWarning()}

              <Button
                onClick={handleFileUpload}
                // disabled={
                //   (mode === "create" && !selectedFile) ||
                //   !title.trim() ||
                //   !description.trim() ||
                //   isUploading ||
                //   (selectedFile && selectedFile.size > 100 * 1024 * 1024 * 1024) // 100GB limit
                // }
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {uploadProgress < 100
                      ? `Téléchargement... ${uploadProgress}%`
                      : "Finalisation..."}
                  </>
                ) : mode === "create" ? (
                  "Ajouter le document"
                ) : (
                  "Modifier le document"
                )}
              </Button>

              {isUploading && uploadProgress > 0 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={cancelUpload}
                    disabled={!isUploading}
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler le téléchargement
                  </Button>
                </div>
              )}
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
            <Card key={doc.id} className="border rounded p-4">
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-8 h-8 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{doc.title}</h4>
                        {doc.ispublish && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Publié
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <Badge variant="secondary">{doc.type}</Badge>
                        <span>
                          Par {doc.creator.firstName} {doc.creator.lastName}
                        </span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
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
