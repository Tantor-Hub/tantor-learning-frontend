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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Ellipsis, Plus } from "lucide-react";
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
import {
  useListStudentDocBySessionIdQuery,
  useUploadDocumentAfterMutation,
} from "@/lib/apis/student/document-api";
import { Loading } from "@/components/shared/loading";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/auth-slice";

type ActionType = "download" | "view" | "edit" | "share" | "delete";

type DocumentType =
  | "QUESTIONNAIRE_SATISFACTION"
  | "PAIEMENT"
  | "DOCUMENTS_FINANCEUR"
  | "FICHE_CONTROLE_FINAL";

export function AfterTab({ sessionId }: { sessionId: number | any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType>("QUESTIONNAIRE_SATISFACTION");
  const [isUploading, setIsUploading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const [uploadDocument] = useUploadDocumentAfterMutation();
  const {
    data: documents,
    isLoading,
    refetch,
  } = useListStudentDocBySessionIdQuery({
    id_session: sessionId,
    group: "after",
    id_student: +currentUser!.id,
  });

  if (isLoading) return <Loading />;

  const documentList = documents?.data?.list || [];

  const handleAction = (action: ActionType, documentId: number, documentName: string): void => {
    console.log(`Action: ${action} on document: ${documentName}`);

    switch (action) {
      case "download":
        // Find the document in the list
        const documentToDownload = documentList.find((doc) => doc.id === documentId);
        if (documentToDownload) {
          window.open(documentToDownload.piece_jointe, "_blank");
        }
        break;
      case "delete":
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${documentName} ?`)) {
          // Here you would typically call an API to delete the document
          // For now, we'll just log it
          console.log(`Deleting document with ID: ${documentId}`);
        }
        break;
      default:
        break;
    }
  };

  const handleAddDocument = () => {
    setSelectedFile(null);
    setSelectedType("QUESTIONNAIRE_SATISFACTION");
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const fileList = e.target.files;
    // if (fileList && fileList.length > 0) {
    //   setSelectedFile(fileList[1]);
    // }
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleTypeChange = (value: DocumentType) => {
    setSelectedType(value);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("id_session", String(sessionId));
      formData.append("piece_jointe", selectedFile); // key must match backend expectation
      formData.append("key_document", String(selectedType));
      formData.append("description", String(selectedFile.name));

      console.log("Uploading with data:", {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        keyDocument: selectedType,
        sessionId: sessionId,
      });

      const response = await uploadDocument({
        id_session: String(sessionId),
        piece_jointe: selectedFile,
        key_document: String(selectedType),
        description: String(selectedFile.name),
      }).unwrap();
      console.log(response);

      toast.success(`Document ${selectedFile.name} uploadé avec succès!`);
      await refetch(); // Refresh the document list
      setIsDialogOpen(false);
      setSelectedFile(null);
      setSelectedType("QUESTIONNAIRE_SATISFACTION");
    } catch (error) {
      console.error("Error uploading document:", error);

      // Better error handling
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as any;
        if (errorData?.message) {
          toast.error(`Erreur: ${errorData.message}`);
        } else {
          toast.error(`Échec de l'upload du document`);
        }
      } else {
        toast.error(`Échec de l'upload du document`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    setSelectedType("QUESTIONNAIRE_SATISFACTION");
  };

  // Helper function to get file extension from URL
  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toLowerCase() || "file";
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  // Helper function to translate document key to readable format
  const translateDocumentKey = (key: string) => {
    const translations: Record<string, string> = {
      QUESTIONNAIRE_SATISFACTION: "Questionnaire de satisfaction",
      PAIEMENT: "Paiement",
      DOCUMENTS_FINANCEUR: "Documents financeur",
      FICHE_CONTROLE_FINAL: "Fiche contrôle final",
    };
    return translations[key] || key;
  };

  return (
    <div className="mx-auto">
      <Button className="my-4" onClick={handleAddDocument}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un document
      </Button>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date d'ajout</TableHead>
            <TableHead>Type de document</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentList.length > 0 ? (
            documentList.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.document}</TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{getFileExtension(document.piece_jointe)}</Badge>
                </TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell>{translateDocumentKey(document.key_document)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge variant="secondary" className="hover:cursor-pointer">
                        <Ellipsis />
                        <span className="sr-only">Ouvrir le menu</span>
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAction("download", document.id, document.document)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
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
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                  <SelectItem value="QUESTIONNAIRE_SATISFACTION">
                    Questionnaire de satisfaction
                  </SelectItem>
                  <SelectItem value="PAIEMENT">Paiement</SelectItem>
                  <SelectItem value="DOCUMENTS_FINANCEUR">Documents financeur</SelectItem>
                  <SelectItem value="FICHE_CONTROLE_FINAL">Fiche contrôle final</SelectItem>
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
