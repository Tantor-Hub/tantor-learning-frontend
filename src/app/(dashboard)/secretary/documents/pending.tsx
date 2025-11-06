import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Download, Ellipsis, Check, X } from "lucide-react";
import { useState } from "react";
import {
  useGetAllDocumentInstancesForSecretaryQuery,
  useUpdateDocumentInstanceSecretaryMutation,
} from "@/lib/apis/documents";
import TemplateView from "./template-view";
const TemplateViewer: any = TemplateView as any;
import {
  useGetAllSessionDocumentsForSecretaryQuery,
  useUpdateSessionDocumentSecretaryMutation,
} from "@/lib/apis/session-document";
import { Loading } from "@/components/shared/loading";
import { toast } from "react-hot-toast";

type ActionType = "view" | "validate" | "reject";

export function PendingTab({ sessionId }: { sessionId: string | null }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const { data: documents, isLoading } = useGetAllDocumentInstancesForSecretaryQuery({
    status: "pending",
    ...(sessionId && { sessionId }),
  });

  const [updateDocumentInstanceSecretary] = useUpdateDocumentInstanceSecretaryMutation();

  // Uploader (legacy)
  const { data: uploadedDocs, isLoading: isLoadingUploaded } =
    useGetAllSessionDocumentsForSecretaryQuery({
      status: "pending",
      ...(sessionId && { sessionId }),
    });
  const [updateSessionDocumentSecretary] = useUpdateSessionDocumentSecretaryMutation();

  if (isLoading || isLoadingUploaded) return <Loading />;

  const documentList = documents?.data || [];

  const handleValidate = async (id: string) => {
    const comment = prompt("Commentaire (optionnel):");
    try {
      await updateDocumentInstanceSecretary({
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

  const handleReject = async (id: string) => {
    const comment = prompt("Raison du rejet:");
    if (comment) {
      try {
        await updateDocumentInstanceSecretary({
          id,
          body: { status: "rejected", comment },
        }).unwrap();
        toast.success("Document rejeté avec succès");
      } catch (error) {
        console.error("Error rejecting document:", error);
        toast.error("Erreur lors du rejet du document");
      }
    }
  };

  const handleAction = (action: ActionType, documentId: string): void => {
    switch (action) {
      case "view":
        setSelectedInstanceId(documentId);
        setIsViewerOpen(true);
        break;
      default:
        break;
    }
  };

  const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

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
      <Tabs defaultValue="remplir">
        <TabsList className="bg-white border">
          <TabsTrigger value="uploader">A Uploader</TabsTrigger>
          <TabsTrigger value="remplir">A Remplir</TabsTrigger>
        </TabsList>

        <TabsContent value="uploader">
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
              {(uploadedDocs?.data || []).length > 0 ? (
                (uploadedDocs?.data || []).map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      {document.student?.firstName} {document.student?.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant={"outline"}>
                        {document.piece_jointe?.split(".").pop()?.toLowerCase() || "file"}
                      </Badge>
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
                          <DropdownMenuItem
                            onClick={() => window.open(document.piece_jointe, "_blank")}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={async () => {
                              const comment = prompt("Commentaire (optionnel):");
                              try {
                                await updateSessionDocumentSecretary({
                                  id: document.id,
                                  body: { status: "validated", ...(comment && { comment }) },
                                }).unwrap();
                                toast.success("Document validé avec succès");
                              } catch (e) {
                                toast.error("Erreur lors de la validation du document");
                              }
                            }}
                            className="text-green-600 focus:text-green-600"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Valider
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              const comment = prompt("Raison du rejet:");
                              if (!comment) return;
                              try {
                                await updateSessionDocumentSecretary({
                                  id: document.id,
                                  body: { status: "rejected", comment },
                                }).unwrap();
                                toast.success("Document rejeté avec succès");
                              } catch (e) {
                                toast.error("Erreur lors du rejet du document");
                              }
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Rejeter
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
        </TabsContent>

        <TabsContent value="remplir">
          <Table className="border mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'eleve</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date d'ajout</TableHead>
                <TableHead>Modèle</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentList.length > 0 ? (
                documentList.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      {document.user?.firstName} {document.user?.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant={"outline"}>
                        {capitalize(document.template?.type || "-")}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(document.createdAt)}</TableCell>
                    <TableCell>{document.template?.title || "-"}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Badge variant="secondary" className="hover:cursor-pointer">
                            <Ellipsis />
                            <span className="sr-only">Ouvrir le menu</span>
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction("view", document.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Ouvrir
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
                            onClick={() => handleReject(document.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Rejeter
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
        </TabsContent>
      </Tabs>
      {isViewerOpen && selectedInstanceId && (
        <TemplateViewer
          {...({
            open: isViewerOpen,
            onOpenChange: (open: boolean) => {
              setIsViewerOpen(open);
              if (!open) setSelectedInstanceId(null);
            },
            instanceId: selectedInstanceId as string,
          } as any)}
        />
      )}
    </div>
  );
}
