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
import { useListStudentDocBySessionIdQuery } from "@/lib/apis/student/document-api";
import { Loading } from "@/components/shared/loading";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectToken } from "@/features/auth/auth-slice";

type ActionType = "download" | "view" | "edit" | "share" | "delete";

/*
{"status":400,"message":"La requête envoyée est invalide. Veuillez vérifier les informations saisies.","data":[{"field":"id_session","errors":["id_session must be a number string"]},{"field":"key_document","errors":["La clé \"undefined\" n'est pas valide. Elle doit être l'un des types de document suivants : CARTE_IDENTITE, CONTRAT_OU_CONVENTION, JUSTIFICATIF_DOMICILE, ANALYSE_BESOIN, FORMULAIRE_HANDICAP, CONVOCATION, PROGRAMME, CONDITIONS_VENTE, REGLEMENT_INTERIEUR, CGV, FICHE_CONTROLE_INITIALE, CONVOCATION_EXAMEN, ATTESTATION_FORMATION, CERTIFICATION, FICHE_CONTROLE_COURS, FICHES_EMARGEMENT, QUESTIONNAIRE_SATISFACTION, PAIEMENT, DOCUMENTS_FINANCEUR, FICHE_CONTROLE_FINALE","key_document should not be empty","key_document must be a string"]}]}
*/

type DocumentType =
  | "CARTE_IDENTITE"
  | "CONTRAT_OU_CONVENTION"
  | "JUSTIFICATIF_DOMICILE"
  | "ANALYSE_BESOIN"
  | "FORMULAIRE_HANDICAP"
  | "PROGRAMME"
  | "CONDITIONS_VENTE"
  | "REGLEMENT_INTERIEUR"
  | "CGV"
  | "FICHE_CONTROLE_INITIALE";

export function AfterTab({ sessionId }: { sessionId: number | any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<DocumentType>("CARTE_IDENTITE");
  const [isUploading, setIsUploading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
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
    setSelectedType("CARTE_IDENTITE");
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleTypeChange = (value: DocumentType) => {
    setSelectedType(value);
  };

  const handleSubmit = async () => {
    toast.loading("Envoie en cours...");
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}sessions/session/document/after`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "x-connexion-tantor": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const responseData = await response.json();
      toast.dismiss();
      toast.success(`Document ${selectedFile.name} uploadé avec succès!`);
      await refetch();
      setIsDialogOpen(false);
      setSelectedFile(null);
      setSelectedType("CARTE_IDENTITE");
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
    setSelectedType("CARTE_IDENTITE");
  };

  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toLowerCase() || "file";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const translateDocumentKey = (key: string) => {
    const translations: Record<string, string> = {
      CARTE_IDENTITE: "Carte d'identité",
      CONTRAT_OU_CONVENTION: "Contrat ou convention",
      JUSTIFICATIF_DOMICILE: "Justificatif de domicile",
      ANALYSE_BESOIN: "Analyse de besoin",
      FORMULAIRE_HANDICAP: "Formulaire handicap",
      PROGRAMME: "Programme",
      CONDITIONS_VENTE: "Conditions de vente",
      REGLEMENT_INTERIEUR: "Règlement intérieur",
      CGV: "Conditions générales de vente",
      FICHE_CONTROLE_INITIALE: "Fiche contrôle initiale",
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
                  <SelectItem value="CARTE_IDENTITE">Carte d'identité</SelectItem>
                  <SelectItem value="CONTRAT_OU_CONVENTION">Contrat ou convention</SelectItem>
                  <SelectItem value="JUSTIFICATIF_DOMICILE">Justificatif de domicile</SelectItem>
                  <SelectItem value="ANALYSE_BESOIN">Analyse de besoin</SelectItem>
                  <SelectItem value="FORMULAIRE_HANDICAP">Formulaire handicap</SelectItem>
                  <SelectItem value="PROGRAMME">Programme</SelectItem>
                  <SelectItem value="CONDITIONS_VENTE">Conditions de vente</SelectItem>
                  <SelectItem value="REGLEMENT_INTERIEUR">Règlement intérieur</SelectItem>
                  <SelectItem value="CGV">Conditions générales de vente</SelectItem>
                  <SelectItem value="FICHE_CONTROLE_INITIALE">Fiche contrôle initiale</SelectItem>
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
