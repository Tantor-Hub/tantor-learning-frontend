"use client";

import React, { useState, useEffect } from "react";
import {
  useGetLessonDocumentByIdQuery,
  useUpdateLessonDocumentMutation,
} from "@/lib/apis/lessondocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, FileText, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateLessonDocumentProps {
  documentId: string;
  onSuccess?: () => void;
}

export function UpdateLessonDocument({ documentId, onSuccess }: UpdateLessonDocumentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [isPublish, setIsPublish] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    data: documentData,
    isLoading: isLoadingDocument,
    error: documentError,
  } = useGetLessonDocumentByIdQuery({ id: documentId }, { skip: !documentId || !isOpen });

  const [updateLessonDocument] = useUpdateLessonDocumentMutation();

  const supportedTypes = [
    "PDF",
    "DOC",
    "DOCX",
    "TXT",
    "JPEG",
    "PNG",
    "GIF",
    "PPT",
    "PPTX",
    "XLS",
    "XLSX",
  ];

  // Populate form when document data is loaded
  useEffect(() => {
    if (documentData?.data && isOpen) {
      setTitle(documentData.data.title || "");
      setDescription(documentData.data.description || "");
      setType(documentData.data.type || "");
      setIsPublish(documentData.data.ispublish || false);
      setSelectedFile(null); // Reset file selection
    }
  }, [documentData, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 50MB");
        return;
      }

      setSelectedFile(file);

      // Auto-detect type if not set
      if (!type) {
        const extension = file.name.split(".").pop()?.toUpperCase();
        if (extension && supportedTypes.includes(extension)) {
          setType(extension);
        }
      }
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error("Veuillez saisir un titre");
      return;
    }

    if (!description.trim()) {
      toast.error("Veuillez saisir une description");
      return;
    }

    if (!documentData?.data?.id_lesson) {
      toast.error("ID de leçon manquant");
      return;
    }

    setIsUpdating(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Only append document if a new file is selected
      if (selectedFile) {
        formData.append("document", selectedFile);
      }

      formData.append("id_lesson", documentData.data.id_lesson);
      formData.append("title", title.trim());
      formData.append("description", description.trim());

      if (type) {
        formData.append("type", type);
      }

      formData.append("ispublish", isPublish.toString());

      await updateLessonDocument({
        id: documentId,
        formData,
      }).unwrap();

      toast.success("Document mis à jour avec succès");

      // Reset form
      setSelectedFile(null);
      setUploadProgress(0);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erreur lors de la mise à jour du document";
      toast.error(errorMessage);
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (documentData?.data) {
      setTitle(documentData.data.title || "");
      setDescription(documentData.data.description || "");
      setType(documentData.data.type || "");
      setIsPublish(documentData.data.ispublish || false);
    }
    setSelectedFile(null);
    setUploadProgress(0);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const currentDocument = documentData?.data;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le document de la leçon</DialogTitle>
        </DialogHeader>

        {isLoadingDocument ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : documentError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Erreur lors du chargement du document</p>
          </div>
        ) : currentDocument ? (
          <div className="space-y-4">
            {/* Current File Info */}
            {!selectedFile && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Fichier actuel: {currentDocument.file_name}
                    </p>
                    <p className="text-xs text-gray-500">Type: {currentDocument.type}</p>
                  </div>
                </div>
              </div>
            )}

            {/* File Selection (Optional - for updating file) */}
            <div>
              <Label htmlFor="document">
                Nouveau document <span className="text-gray-500">(optionnel)</span>
              </Label>
              <Input
                id="document"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.xls,.xlsx"
                disabled={isUpdating}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formats supportés: PDF, DOC, DOCX, TXT, Images, PPT, XLS. Max: 50MB
              </p>
            </div>

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{selectedFile.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      const fileInput = document.querySelector(
                        'input[type="file"]'
                      ) as HTMLInputElement;
                      if (fileInput) {
                        fileInput.value = "";
                      }
                    }}
                    disabled={isUpdating}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez le titre du document"
                disabled={isUpdating}
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Entrez une description du document"
                disabled={isUpdating}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={isUpdating}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Auto-détecter</option>
                {supportedTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ispublish"
                checked={isPublish}
                onCheckedChange={(checked) => setIsPublish(!!checked)}
                disabled={isUpdating}
              />
              <Label
                htmlFor="ispublish"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Publier immédiatement
              </Label>
            </div>

            {/* Update Progress */}
            {isUpdating && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Mise à jour en cours...</span>
                  <span className="text-sm font-semibold text-blue-600">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  handleCancel();
                  setIsOpen(false);
                }}
                disabled={isUpdating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!title.trim() || !description.trim() || isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-600">Document non trouvé</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
