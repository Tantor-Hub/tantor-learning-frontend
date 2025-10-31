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
import { useSelector } from "react-redux";
import { selectCurrentUser, selectToken } from "@/features/auth/auth-slice";

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
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);

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

  const handleAction = (action: ActionType, documentId: number, documentName: string): void => {
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
          console.log(`Deleting document with ID: ${documentId}`);
        }
        break;
      default:
        break;
    }
  };

  const handleAddDocument = () => {
    setSelectedFile(null);
    setSelectedType(Object.keys(documentTypes)[0]);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleSubmit = async () => {
    toast.loading("Envoi en cours...");
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append("piece_jointe", selectedFile);
    formData.append("id_session", String(sessionId));
    formData.append("key_document", selectedType);
    formData.append("description", selectedFile.name);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${apiEndpoint}`, {
        method: "PUT",
        body: formData,
        headers: {
          "x-connexion-tantor": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Échec de l'upload du document");
      } else {
        toast.dismiss();
        toast.success(`Document ${selectedFile.name} uploadé avec succès!`);
        await onRefetch();
        setIsDialogOpen(false);
        setSelectedFile(null);
        setSelectedType(Object.keys(documentTypes)[0]);
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error uploading document:", error);
      if (error instanceof Error) {
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.error(`Échec de l'upload du document`);
      }
    } finally {
      toast.dismiss();
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
              const submittedDoc = documentList.find((doc) => doc.key_document === requiredDoc);
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
                    {submittedDoc ? submittedDoc.document : translateDocumentKey(requiredDoc)}
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
                        <DropdownMenuItem onClick={handleAddDocument}>
                          <Upload className="mr-2 h-4 w-4" />
                          Uploader
                        </DropdownMenuItem>
                        {submittedDoc && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction("download", submittedDoc.id, submittedDoc.document)
                              }
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction("delete", submittedDoc.id, submittedDoc.document)
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
                <TableCell className="font-medium">{document.document}</TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{getFileExtension(document.piece_jointe)}</Badge>
                </TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell>{translateDocumentKey(document.key_document)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <Ellipsis className="h-4 w-4" />
                        <span className="sr-only">Ouvrir le menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleAddDocument}>
                        <Upload className="mr-2 h-4 w-4" />
                        Uploader
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("download", document.id, document.document)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("delete", document.id, document.document)}
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
              <Select value={selectedType} onValueChange={handleTypeChange} disabled={isUploading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type de document" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(documentTypes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
