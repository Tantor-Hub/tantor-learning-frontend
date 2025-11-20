"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetSessionByIdQuery,
  useUpdateSessionMutation,
  useCreateSurveyQuestionMutation,
  useGetSurveysBySessionQuery,
  useDeleteSurveyQuestionMutation,
} from "@/lib/apis/secretary/session-secretary-api";
import {
  useCreateDocumentTemplateMutation,
  useGetDocumentTemplatesQuery,
  useGetDocumentsTemplatesBySessionIdQuery,
  useGetDocumentTemplateByIdQuery,
  useLazyGetDocumentTemplateByIdQuery,
  useUpdateDocumentTemplateMutation,
} from "@/lib/apis/documents";

import { toast } from "react-hot-toast";
import { Loader2, Save, Plus, FileText, Trash2, FileDown, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyQuestionBuilder } from "./components/survey-question-builder";
import { Badge } from "@/components/ui/badge";
import DocumentTemplateBuilder from "./components/document-template-builder";

interface Placeholder {
  key: string;
  label: string;
  value: string;
}

interface SelectedDocument {
  value: string;
  placeholders: Placeholder[];
}

interface SelectedDocuments {
  before: SelectedDocument[];
  during: SelectedDocument[];
  after: SelectedDocument[];
}

const DOCUMENT_CATEGORIES = {
  before: [
    { value: "CARTE_IDENTITE", label: "Carte d'identité" },
    { value: "CONTRAT_OU_CONVENTION", label: "Contrat ou convention" },
    { value: "JUSTIFICATIF_DOMICILE", label: "Justificatif de domicile" },
    { value: "ANALYSE_BESOIN", label: "Analyse de besoin" },
    { value: "FORMULAIRE_HANDICAP", label: "Formulaire handicap" },
    { value: "CONVOCATION", label: "Convocation" },
    { value: "PROGRAMME", label: "Programme" },
    { value: "CONDITIONS_VENTE", label: "Conditions de vente" },
    { value: "REGLEMENT_INTERIEUR", label: "Règlement intérieur" },
    { value: "CGV", label: "Conditions générales de vente (CGV)" },
    { value: "FICHE_CONTROLE_INITIALE", label: "Fiche contrôle initiale" },
  ],
  during: [
    { value: "CONVOCATION_EXAMEN", label: "Convocation examen" },
    { value: "ATTESTATION_FORMATION", label: "Attestation formation" },
    { value: "CERTIFICATION", label: "Certification" },
    { value: "FICHE_CONTROLE_COURS", label: "Fiche contrôle cours" },
    { value: "FICHES_EMARGEMENT", label: "Fiches émargement" },
  ],
  after: [
    { value: "QUESTIONNAIRE_SATISFACTION", label: "Questionnaire satisfaction" },
    { value: "PAIEMENT", label: "Paiement" },
    { value: "DOCUMENTS_FINANCEUR", label: "Documents financeur" },
    { value: "FICHE_CONTROLE_FINALE", label: "Fiche contrôle finale" },
  ],
};

export default function Documents() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const { data: session, isLoading: sessionLoading } = useGetSessionByIdQuery({ id: sessionId });
  const [updateSession, { isLoading: updating }] = useUpdateSessionMutation();
  const [createDocumentTemplate, { isLoading: creatingTemplate }] =
    useCreateDocumentTemplateMutation();
  const [updateDocumentTemplate, { isLoading: updatingTemplate }] =
    useUpdateDocumentTemplateMutation();
  const { data: templatesData, isLoading: templatesLoading } =
    useGetDocumentsTemplatesBySessionIdQuery({
      sessionId,
    });

  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocuments>({
    before: (session?.data?.required_document_before || []).map((value) => ({
      value,
      placeholders: [],
    })),
    during: (session?.data?.required_document_during || []).map((value) => ({
      value,
      placeholders: [],
    })),
    after: (session?.data?.required_document_after || []).map((value) => ({
      value,
      placeholders: [],
    })),
  });

  React.useEffect(() => {
    if (session?.data) {
      setSelectedDocuments({
        before: (session.data.required_document_before || []).map((value) => ({
          value,
          placeholders: [],
        })),
        during: (session.data.required_document_during || []).map((value) => ({
          value,
          placeholders: [],
        })),
        after: (session.data.required_document_after || []).map((value) => ({
          value,
          placeholders: [],
        })),
      });
    }
  }, [session]);

  const [surveyBuilderOpen, setSurveyBuilderOpen] = React.useState(false);
  const [documentTemplateBuilderOpen, setDocumentTemplateBuilderOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<"before" | "during" | "after">(
    "before"
  );
  const [editingTemplate, setEditingTemplate] = React.useState<{
    id: string | null;
    title?: string;
    content?: any;
    variables?: string[];
  }>({ id: null });

  // Use lazy query to fetch template data only when needed
  const [getTemplateById, { data: editingTemplateData, isLoading: editingTemplateLoading }] =
    useLazyGetDocumentTemplateByIdQuery();

  const handleDocumentToggle = (category: "before" | "during" | "after", documentValue: string) => {
    setSelectedDocuments((prev) => ({
      ...prev,
      [category]: prev[category].some((doc) => doc.value === documentValue)
        ? prev[category].filter((doc) => doc.value !== documentValue)
        : [...prev[category], { value: documentValue, placeholders: [] }],
    }));
  };

  const handleSave = async () => {
    try {
      await updateSession({
        id: sessionId,
        required_document_before: selectedDocuments.before.map((doc) => doc.value),
        required_document_during: selectedDocuments.during.map((doc) => doc.value),
        required_document_after: selectedDocuments.after.map((doc) => doc.value),
      }).unwrap();
      toast.success("Documents requis mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  const openDocumentTemplateBuilder = async (
    category: "before" | "during" | "after",
    templateId?: string
  ) => {
    setSelectedCategory(category);

    if (templateId) {
      // Set editing state first
      setEditingTemplate({ id: templateId });

      try {
        // Fetch template data
        const result = await getTemplateById({ id: templateId }).unwrap();

        // Open dialog after data is fetched
        setDocumentTemplateBuilderOpen(true);
      } catch (error) {
        toast.error("Erreur lors du chargement du modèle");
        console.error(error);
        setEditingTemplate({ id: null });
      }
    } else {
      // For new template, open immediately
      setEditingTemplate({ id: null });
      setDocumentTemplateBuilderOpen(true);
    }
  };

  const handleCreateDocumentTemplate = async (template: {
    title: string;
    content: any;
    variables: string[];
    sessionId: string;
    type: "before" | "during" | "after";
    signature?: boolean;
  }) => {
    try {
      if (editingTemplate.id) {
        await updateDocumentTemplate({
          id: editingTemplate.id,
          title: template.title,
          content: template.content,
          variables: template.variables,
          signature: template.signature,
        }).unwrap();
        toast.success("Modèle de document mis à jour avec succès !");
      } else {
        await createDocumentTemplate({
          title: template.title,
          content: template.content,
          sessionId: template.sessionId,
          type: template.type,
          variables: template.variables,
          signature: template.signature,
        }).unwrap();
        toast.success(
          "Modèle de document sauvegardé avec succès ! Vous pouvez continuer à éditer."
        );
      }
      setEditingTemplate({ id: null });
      // Keep the dialog open to allow continued editing
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du modèle");
      console.error(error);
    }
  };

  const handleDialogClose = () => {
    setDocumentTemplateBuilderOpen(false);
    setEditingTemplate({ id: null });
  };

  if (sessionLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-4" />

          <div className="space-y-4">
            {/* Before training skeleton */}
            <div className="border rounded-lg">
              <div className="p-4 border-b">
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                    >
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* During training skeleton */}
            <div className="border rounded-lg">
              <div className="p-4 border-b">
                <Skeleton className="h-5 w-44" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                    >
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* After training skeleton */}
            <div className="border rounded-lg">
              <div className="p-4 border-b">
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                    >
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Documents requis pour la session</h3>
        <p className="text-sm text-gray-600 mb-4">
          Sélectionnez les formulaires que les étudiants devront compléter à différentes étapes de
          la formation.
        </p>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="before">
            <AccordionTrigger>Avant la formation</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Documents Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Documents requis</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openDocumentTemplateBuilder("before")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un modèle
                    </Button>
                  </div>

                  {/* Document Templates Section */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Modèles de documents créés</h5>
                    <div className="space-y-2">
                      {templatesData?.data
                        ?.filter((template) => template.type === "before")
                        .map((template) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium">{template.title}</p>
                                <p className="text-xs text-gray-500">
                                  {template.variables?.length || 0} variable(s)
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => openDocumentTemplateBuilder("before", template.id)}
                                title="Edit template"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      {(!templatesData?.data ||
                        templatesData.data.filter((template) => template.type === "before")
                          .length === 0) && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Aucun modèle créé pour cette catégorie
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DOCUMENT_CATEGORIES.before.map((document) => (
                      <div
                        key={document.value}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={document.value}
                          checked={selectedDocuments.before.some(
                            (doc) => doc.value === document.value
                          )}
                          onCheckedChange={() => handleDocumentToggle("before", document.value)}
                        />
                        <Label
                          htmlFor={document.value}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {document.label}
                        </Label>
                        {selectedDocuments.before.some((doc) => doc.value === document.value) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileDown className="w-4 h-4 mr-2" />
                                Configurer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Configurer les placeholders pour {document.label}
                                </DialogTitle>
                              </DialogHeader>
                              <PlaceholderConfigurator
                                document={
                                  selectedDocuments.before.find(
                                    (doc) => doc.value === document.value
                                  )!
                                }
                                onUpdate={(placeholders) => {
                                  setSelectedDocuments((prev) => ({
                                    ...prev,
                                    before: prev.before.map((doc) =>
                                      doc.value === document.value ? { ...doc, placeholders } : doc
                                    ),
                                  }));
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="during">
            <AccordionTrigger>Pendant la formation</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Documents Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Documents requis</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openDocumentTemplateBuilder("during")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un modèle
                    </Button>
                  </div>

                  {/* Document Templates Section */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Modèles de documents créés</h5>
                    <div className="space-y-2">
                      {templatesData?.data
                        ?.filter((template) => template.type === "during")
                        .map((template) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium">{template.title}</p>
                                <p className="text-xs text-gray-500">
                                  {template.variables?.length || 0} variable(s)
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => openDocumentTemplateBuilder("during", template.id)}
                              title="Edit template"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      {(!templatesData?.data ||
                        templatesData.data.filter((template) => template.type === "during")
                          .length === 0) && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Aucun modèle créé pour cette catégorie
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DOCUMENT_CATEGORIES.during.map((document) => (
                      <div
                        key={document.value}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={document.value}
                          checked={selectedDocuments.during.some(
                            (doc) => doc.value === document.value
                          )}
                          onCheckedChange={() => handleDocumentToggle("during", document.value)}
                        />
                        <Label
                          htmlFor={document.value}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {document.label}
                        </Label>
                        {selectedDocuments.during.some((doc) => doc.value === document.value) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileDown className="w-4 h-4 mr-2" />
                                Configurer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Configurer les placeholders pour {document.label}
                                </DialogTitle>
                              </DialogHeader>
                              <PlaceholderConfigurator
                                document={
                                  selectedDocuments.during.find(
                                    (doc) => doc.value === document.value
                                  )!
                                }
                                onUpdate={(placeholders) => {
                                  setSelectedDocuments((prev) => ({
                                    ...prev,
                                    during: prev.during.map((doc) =>
                                      doc.value === document.value ? { ...doc, placeholders } : doc
                                    ),
                                  }));
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="after">
            <AccordionTrigger>Après la formation</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Documents Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Documents requis</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openDocumentTemplateBuilder("after")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un modèle
                    </Button>
                  </div>

                  {/* Document Templates Section */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Modèles de documents créés</h5>
                    <div className="space-y-2">
                      {templatesData?.data
                        ?.filter((template) => template.type === "after")
                        .map((template) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium">{template.title}</p>
                                <p className="text-xs text-gray-500">
                                  {template.variables?.length || 0} variable(s)
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => openDocumentTemplateBuilder("after", template.id)}
                              title="Edit template"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      {(!templatesData?.data ||
                        templatesData.data.filter((template) => template.type === "after")
                          .length === 0) && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Aucun modèle créé pour cette catégorie
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DOCUMENT_CATEGORIES.after.map((document) => (
                      <div
                        key={document.value}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={document.value}
                          checked={selectedDocuments.after.some(
                            (doc) => doc.value === document.value
                          )}
                          onCheckedChange={() => handleDocumentToggle("after", document.value)}
                        />
                        <Label
                          htmlFor={document.value}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {document.label}
                        </Label>
                        {selectedDocuments.after.some((doc) => doc.value === document.value) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileDown className="w-4 h-4 mr-2" />
                                Configurer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Configurer les placeholders pour {document.label}
                                </DialogTitle>
                              </DialogHeader>
                              <PlaceholderConfigurator
                                document={
                                  selectedDocuments.after.find(
                                    (doc) => doc.value === document.value
                                  )!
                                }
                                onUpdate={(placeholders) => {
                                  setSelectedDocuments((prev) => ({
                                    ...prev,
                                    after: prev.after.map((doc) =>
                                      doc.value === document.value ? { ...doc, placeholders } : doc
                                    ),
                                  }));
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            📋 Documents sélectionnés:{" "}
            {selectedDocuments.before.length +
              selectedDocuments.during.length +
              selectedDocuments.after.length}
          </p>
          <Button onClick={handleSave} disabled={updating} className="flex items-center gap-2">
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Document Template Builder */}
      <DocumentTemplateBuilder
        open={documentTemplateBuilderOpen}
        onOpenChange={handleDialogClose}
        onSave={handleCreateDocumentTemplate}
        sessionId={sessionId}
        type={selectedCategory}
        templateData={editingTemplateData} // Pass the actual data from the response
        isLoading={editingTemplateLoading}
        isEditing={!!editingTemplate.id}
        templates={templatesData?.data || []}
      />
    </div>
  );
}

interface PlaceholderConfiguratorProps {
  document: SelectedDocument;
  onUpdate: (placeholders: Placeholder[]) => void;
}

function PlaceholderConfigurator({ document, onUpdate }: PlaceholderConfiguratorProps) {
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(document.placeholders);

  const addPlaceholder = () => {
    setPlaceholders([...placeholders, { key: "", label: "", value: "" }]);
  };

  const updatePlaceholder = (index: number, field: keyof Placeholder, value: string) => {
    const updated = placeholders.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    setPlaceholders(updated);
    onUpdate(updated);
  };

  const removePlaceholder = (index: number) => {
    const updated = placeholders.filter((_, i) => i !== index);
    setPlaceholders(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Placeholders</h4>
        <Button type="button" variant="outline" size="sm" onClick={addPlaceholder}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      <div className="space-y-2">
        {placeholders.map((placeholder, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder="Clé (ex: {{nom}})"
              value={placeholder.key}
              onChange={(e) => updatePlaceholder(index, "key", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Label"
              value={placeholder.label}
              onChange={(e) => updatePlaceholder(index, "label", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Valeur par défaut"
              value={placeholder.value}
              onChange={(e) => updatePlaceholder(index, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removePlaceholder(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
