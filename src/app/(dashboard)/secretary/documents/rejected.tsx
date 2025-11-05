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
import { Download, Ellipsis, Check, RotateCcw } from "lucide-react";
import {
  useGetAllSessionDocumentsForSecretaryQuery,
  useUpdateSessionDocumentSecretaryMutation,
} from "@/lib/apis/session-document";
import { Loading } from "@/components/shared/loading";
import { toast } from "react-hot-toast";

type ActionType = "download" | "validate" | "reset";

export function RejectedTab({ sessionId }: { sessionId: string | null }) {
  const { data: documents, isLoading } = useGetAllSessionDocumentsForSecretaryQuery({
    status: "rejected",
    ...(sessionId && { sessionId }),
  });

  const [updateSessionDocumentSecretary] = useUpdateSessionDocumentSecretaryMutation();

  if (isLoading) return <Loading />;

  const documentList = documents?.data || [];

  const handleValidate = async (id: string) => {
    const comment = prompt("Commentaire (optionnel):");
    try {
      await updateSessionDocumentSecretary({
        id,
        body: {
          status: "validated",
          ...(comment && { comment }),
        },
      }).unwrap();
      toast.success("Document validé avec succès");
    } catch (error) {
      console.error("Error validating document:", error);
      toast.error("Erreur lors de la validation du document");
    }
  };

  const handleResetToPending = async (id: string) => {
    const comment = prompt("Commentaire (optionnel):");
    try {
      await updateSessionDocumentSecretary({
        id,
        body: {
          status: "pending",
          ...(comment && { comment }),
        },
      }).unwrap();
      toast.success("Document remis en attente");
    } catch (error) {
      console.error("Error resetting document:", error);
      toast.error("Erreur lors de la remise en attente");
    }
  };

  const handleAction = (action: ActionType, documentId: string): void => {
    switch (action) {
      case "download":
        const documentToDownload = documentList.find((doc) => doc.id === documentId);
        if (documentToDownload) {
          window.open(documentToDownload.piece_jointe, "_blank");
        }
        break;
      default:
        break;
    }
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
      <Table className="border mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Nom d'eleve</TableHead>
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
                <TableCell className="font-medium">
                  {document.student?.firstName} {document.student?.lastName}
                </TableCell>
                <TableCell>
                  <Badge variant={"outline"}>{getFileExtension(document.piece_jointe)}</Badge>
                </TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell>{translateDocumentKey(document.type)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge variant="secondary" className="hover:cursor-pointer">
                        <Ellipsis />
                        <span className="sr-only">Ouvrir le menu</span>
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction("download", document.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleValidate(document.id)}
                        className="text-green-600 focus:text-green-600"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Valider
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleResetToPending(document.id)}
                        className="text-orange-600 focus:text-orange-600"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Remettre en attente
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
    </div>
  );
}
