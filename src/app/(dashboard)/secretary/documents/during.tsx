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
import { Download, Trash2, Ellipsis } from "lucide-react";
import { useListStudentDocBySessionIdQuery } from "@/lib/apis/student/document-api";
import { Loading } from "@/components/shared/loading";

type ActionType = "download" | "view" | "edit" | "share" | "delete";

export function DuringTab({
  sessionId,
  studentId,
}: {
  sessionId: number | any;
  studentId: string | any;
}) {
  const { data: documents, isLoading } = useListStudentDocBySessionIdQuery({
    id_session: sessionId,
    group: "during",
    id_student: studentId,
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
    </div>
  );
}
