import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Ellipsis, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import {
  useDeleteSessionDocumentMutation,
  useCreateSessionDocumentMutation,
} from "@/lib/apis/session-document";
import { getAuthToken } from "@/lib/cookies";

type ActionType = "download" | "view" | "edit" | "share" | "delete";

interface DocumentTableProps {
  sessionId: string;
  group: "before" | "during" | "after";
  documentTypes: Record<string, string>;
  requiredDocuments: string[];
  documents: any[];
  isLoading: boolean;
  onRefetch: () => void;
  apiEndpoint: string;
}

export function DocumentTable({
  sessionId,
  group,
  documentTypes,
  requiredDocuments,
  documents,
  isLoading,
  onRefetch,
  apiEndpoint,
}: DocumentTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>(Object.keys(documentTypes)[0]);
  const [isUploading, setIsUploading] = useState(false);
  const token = getAuthToken();
  const [deleteSessionDocument] = useDeleteSessionDocumentMutation();
  const [createSessionDocument] = useCreateSessionDocumentMutation();

  if (isLoading) {
    return (
      <div className="mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="border rounded-lg">
          <div className="p-4">
            <Skeleton className="h-6 w-64 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-4 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const documentList = documents || [];

  const handleAction = async (
    action: ActionType,
    documentId: string,
    documentName: string
  ): Promise<void> => {
    console.log(`Action: ${action} on document: ${documentName}`);

    switch (action) {
      case "download":
        const documentToDownload = documentList.find((doc) => doc.id === documentId);
        if (documentToDownload) {
          window.open(documentToDownload.piece_jointe, "_blank");
        }
        break;
      case "delete":
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${documentName} ?`)) {
          try {
            await deleteSessionDocument(documentId).unwrap();
            toast.success("Document supprimé avec succès");
            onRefetch();
          } catch (error) {
            console.error("Error deleting document:", error);
            toast.error("Échec de la suppression du document");
          }
        }
        break;
      default:
        break;
    }
  };

  const handleAddDocument = (documentType: string) => {
    setSelectedFile(null);
    setSelectedType(documentType);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    setIsUploading(true);

    try {
      await createSessionDocument({
        type: selectedType,
        id_session: String(sessionId),
        categories: group,
        piece_jointe: selectedFile,
      }).unwrap();

      toast.success(`Document ${selectedFile.name} uploadé avec succès!`);
      onRefetch();
      setIsDialogOpen(false);
      setSelectedFile(null);
      setSelectedType(Object.keys(documentTypes)[0]);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Échec de l'upload du document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    setSelectedType(Object.keys(documentTypes)[0]);
  };

  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toLowerCase() || "file";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const translateDocumentKey = (key: string) => {
    return documentTypes[key] || key;
  };

  return (
    <div className="mx-auto">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date d'ajout</TableHead>
            <TableHead>Type de document</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requiredDocuments.length > 0 ? (
            requiredDocuments.map((requiredDoc, index) => {
              const submittedDoc = documentList.find((doc) => doc.type === requiredDoc);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={!!submittedDoc}
                      readOnly
                      className="rounded border-gray-300"
                      title={submittedDoc ? "Document soumis" : "Document non soumis"}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {submittedDoc
                      ? documentTypes[submittedDoc.type] || submittedDoc.type
                      : translateDocumentKey(requiredDoc)}
                  </TableCell>
                  <TableCell>
                    {submittedDoc ? (
                      <Badge variant={"outline"}>
                        {getFileExtension(submittedDoc.piece_jointe)}
                      </Badge>
                    ) : (
                      <Badge variant={"secondary"}>Non soumis</Badge>
                    )}
                  </TableCell>
                  <TableCell>{submittedDoc ? formatDate(submittedDoc.createdAt) : "-"}</TableCell>
                  <TableCell>{translateDocumentKey(requiredDoc)}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <Ellipsis className="h-4 w-4" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddDocument(requiredDoc)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Uploader
                        </DropdownMenuItem>
                        {submittedDoc && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction(
                                  "download",
                                  submittedDoc.id,
                                  documentTypes[submittedDoc.type] || submittedDoc.type
                                )
                              }
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction(
                                  "delete",
                                  submittedDoc.id,
                                  documentTypes[submittedDoc.type] || submittedDoc.type
                                )
                              }
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : documentList.length > 0 ? (
            documentList.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="rounded border-gray-300"
                    title="Document soumis"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {documentTypes[document.type] || document.type}
                </TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{getFileExtension(document.piece_jointe)}</Badge>
                </TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell>{documentTypes[document.type] || document.type}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <Ellipsis className="h-4 w-4" />
                        <span className="sr-only">Ouvrir le menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAddDocument(document.type)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Uploader
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleAction(
                            "download",
                            document.id,
                            documentTypes[document.type] || document.type
                          )
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleAction(
                            "delete",
                            document.id,
                            documentTypes[document.type] || document.type
                          )
                        }
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Aucun document disponible pour le moment
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file-input">Sélectionner un fichier</Label>
              <Input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Fichier sélectionné: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="document-type">Type de document</Label>
              <Input
                id="document-type"
                value={documentTypes[selectedType] || selectedType}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isUploading}>
              Annuler
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isUploading || !selectedFile}>
              {isUploading ? "Envoi en cours..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
