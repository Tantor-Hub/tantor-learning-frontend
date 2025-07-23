"use client";
import React, { useState } from "react";
import { Upload, FileText, X, FileDown } from "lucide-react";
import { useAddDocumentToCourseMutation } from "@/lib/apis/instructor/instructor";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface Document {
  id: number;
  file_name: string;
  url: string;
  type: string;
}

interface DocumentTabsProps {
  courseId: string;
  initialDocuments: Document[];
  refetchCourse: () => void;
}

export function DocumentTabs({ courseId, initialDocuments, refetchCourse }: DocumentTabsProps) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [handleUploadDocument, { isLoading: isLoadingHandleUploadDocument }] =
    useAddDocumentToCourseMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    setNewFiles([...newFiles, ...files]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setNewFiles([...newFiles, ...files]);
  };

  const removeNewFile = (index: number): void => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const handleDownload = (document: Document) => {
    // toast.loading(`Ouverture de ${document.name}...`);
    window.open(document.url, "_blank");
    // Note: Vous ne pouvez pas détecter si le téléchargement a réussi avec cette méthode
  };

  const uploadDocuments = async (): Promise<void> => {
    if (newFiles.length === 0) return;

    try {
      for (const file of newFiles) {
        const toastId = toast.loading(`Upload de ${file.name}...`);

        try {
          const payload = {
            document_name: file.name,
            piece_jointe: file,
            id_cours: courseId,
            id_session: "2", // Make dynamic if needed
          };

          await handleUploadDocument(payload).unwrap();
          toast.success(`${file.name} uploadé avec succès`, { id: toastId });
        } catch (fileError) {
          toast.error(`Erreur lors de l'upload de ${file.name}`, { id: toastId });
        }
      }

      setNewFiles([]);
      await refetchCourse();
      toast.success("Tous les fichiers ont été traités");
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Erreur lors de l'upload des documents");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Documents du cours</h2>
        {newFiles.length > 0 && (
          <button
            onClick={uploadDocuments}
            disabled={isLoadingHandleUploadDocument}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isLoadingHandleUploadDocument ? "Upload..." : `Uploader ${newFiles.length} fichier(s)`}
          </button>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50"
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">Déposez vos documents ici</p>
        <p className="text-sm text-gray-500 mb-4">PDF, DOCX, PPTX jusqu'à 100 MB</p>

        <label className="inline-block">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <span className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            Parcourir les fichiers
          </span>
        </label>
      </div>

      {/* New Files Preview */}
      {newFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3">Fichiers à uploader:</h3>
          <div className="space-y-2">
            {newFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <button
                  onClick={() => removeNewFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Documents */}
      {initialDocuments && initialDocuments.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Documents existants:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-500">{doc.type}</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1 truncate">{doc.file_name}</h4>
                <Button onClick={() => handleDownload(doc)} size="sm">
                  <FileDown className="w-3 h-3" />
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
