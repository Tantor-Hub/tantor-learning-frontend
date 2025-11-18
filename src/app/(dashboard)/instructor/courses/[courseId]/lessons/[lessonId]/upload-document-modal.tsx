"use client";

import React, { useState } from "react";
import { useCreateLessonDocumentMutation } from "@/lib/apis/lessondocument";
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
import { Upload, X, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

interface UploadDocumentModalProps {
  lessonId: string;
  onSuccess?: () => void;
}

export function UploadDocumentModal({ lessonId, onSuccess }: UploadDocumentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [isPublish, setIsPublish] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [createLessonDocument] = useCreateLessonDocumentMutation();

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

      // Auto-set title if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    if (!title.trim()) {
      toast.error("Veuillez saisir un titre");
      return;
    }

    if (!description.trim()) {
      toast.error("Veuillez saisir une description");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("id_lesson", lessonId);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (type) formData.append("type", type);
      formData.append("ispublish", isPublish.toString());

      await createLessonDocument(formData).unwrap();

      toast.success("Document ajouté avec succès");

      // Reset form
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setType("");
      setIsPublish(false);
      setUploadProgress(0);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erreur lors du téléchargement du document";
      toast.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setType("");
    setIsPublish(false);
    setUploadProgress(0);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          + Ajouter un document
          <Upload className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un document à la leçon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Selection */}
          <div>
            <Label htmlFor="document">Document *</Label>
            <Input
              id="document"
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.xls,.xlsx"
              disabled={isUploading}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Formats supportés: PDF, DOC, DOCX, TXT, Images, PPT, XLS. Max: 50MB
            </p>
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
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
                  disabled={isUploading}
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
              disabled={isUploading}
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
              disabled={isUploading}
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
              disabled={isUploading}
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
            <input
              type="checkbox"
              id="ispublish"
              checked={isPublish}
              onChange={(e) => setIsPublish(e.target.checked)}
              disabled={isUploading}
              className="rounded"
            />
            <Label htmlFor="ispublish">Publier immédiatement</Label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Téléchargement en cours...
                </span>
                <span className="text-sm font-semibold text-blue-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>
              Annuler
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !title.trim() || !description.trim() || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? "Téléchargement..." : "Ajouter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
