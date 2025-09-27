"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useGetSessionByIdQuery,
  useUpdateSessionMutation,
  useCreateSurveyQuestionMutation,
  useGetSurveysBySessionQuery,
  useDeleteSurveyQuestionMutation,
} from "@/lib/apis/secretary/session-secretary-api";

import { toast } from "react-hot-toast";
import { Loader2, Save, Plus, FileText, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyQuestionBuilder } from "./components/survey-question-builder";
import { Badge } from "@/components/ui/badge";

interface SelectedDocuments {
  before: string[];
  during: string[];
  after: string[];
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
  console.log(sessionId);
  const { data: session, isLoading: sessionLoading } = useGetSessionByIdQuery({ id: sessionId });
  const [updateSession, { isLoading: updating }] = useUpdateSessionMutation();
  const [createSurvey, { isLoading: creatingSurvey }] = useCreateSurveyQuestionMutation();
  const [deleteSurvey] = useDeleteSurveyQuestionMutation();
  const { data: surveysData, isLoading: surveysLoading } = useGetSurveysBySessionQuery({
    sessionId,
  });

  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocuments>({
    before: session?.data?.required_document_before || [],
    during: session?.data?.required_document_during || [],
    after: session?.data?.required_document_after || [],
  });

  React.useEffect(() => {
    if (session?.data) {
      setSelectedDocuments({
        before: session.data.required_document_before || [],
        during: session.data.required_document_during || [],
        after: session.data.required_document_after || [],
      });
    }
  }, [session]);

  const [surveyBuilderOpen, setSurveyBuilderOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<"before" | "during" | "after">(
    "before"
  );

  const handleDocumentToggle = (category: "before" | "during" | "after", documentValue: string) => {
    setSelectedDocuments((prev) => ({
      ...prev,
      [category]: prev[category].includes(documentValue)
        ? prev[category].filter((doc) => doc !== documentValue)
        : [...prev[category], documentValue],
    }));
  };

  const handleSave = async () => {
    try {
      await updateSession({
        id: sessionId,
        required_document_before: selectedDocuments.before,
        required_document_during: selectedDocuments.during,
        required_document_after: selectedDocuments.after,
      }).unwrap();
      toast.success("Documents requis mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  const handleCreateSurvey = async (title: string, questions: any[]) => {
    try {
      await createSurvey({
        title,
        id_session: sessionId,
        categories: selectedCategory,
        questions,
      }).unwrap();
      toast.success("Questionnaire créé avec succès");
      setSurveyBuilderOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la création du questionnaire");
      console.error(error);
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    try {
      await deleteSurvey({ id: surveyId }).unwrap();
      toast.success("Questionnaire supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du questionnaire");
      console.error(error);
    }
  };

  const openSurveyBuilder = (category: "before" | "during" | "after") => {
    setSelectedCategory(category);
    setSurveyBuilderOpen(true);
  };

  const surveys = surveysData?.data?.surveys || [];

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

  console.log(JSON.stringify(session));
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
                  <h4 className="text-sm font-medium mb-3">Documents requis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DOCUMENT_CATEGORIES.before.map((document) => (
                      <div
                        key={document.value}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={document.value}
                          checked={selectedDocuments.before.includes(document.value)}
                          onCheckedChange={() => handleDocumentToggle("before", document.value)}
                        />
                        <Label
                          htmlFor={document.value}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {document.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Surveys Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Questionnaires</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openSurveyBuilder("before")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un questionnaire
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {surveys
                      .filter((survey) => survey.categories === "before")
                      .map((survey) => (
                        <div
                          key={survey.id}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">{survey.title}</p>
                              <p className="text-xs text-gray-500">
                                {survey.questions?.length || 0} question(s)
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSurvey(survey.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    {surveys.filter((survey) => survey.categories === "before").length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Aucun questionnaire créé pour cette catégorie
                      </p>
                    )}
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
                  <h4 className="text-sm font-medium mb-3">Documents requis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DOCUMENT_CATEGORIES.during.map((document) => (
                      <div
                        key={document.value}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={document.value}
                          checked={selectedDocuments.during.includes(document.value)}
                          onCheckedChange={() => handleDocumentToggle("during", document.value)}
                        />
                        <Label
                          htmlFor={document.value}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {document.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Surveys Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Questionnaires</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openSurveyBuilder("during")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un questionnaire
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {surveys
                      .filter((survey) => survey.categories === "during")
                      .map((survey) => (
                        <div
                          key={survey.id}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">{survey.title}</p>
                              <p className="text-xs text-gray-500">
                                {survey.questions?.length || 0} question(s)
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSurvey(survey.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    {surveys.filter((survey) => survey.categories === "during").length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Aucun questionnaire créé pour cette catégorie
                      </p>
                    )}
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
                  <h4 className="text-sm font-medium mb-3">Documents requis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DOCUMENT_CATEGORIES.after.map((document) => (
                      <div
                        key={document.value}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={document.value}
                          checked={selectedDocuments.after.includes(document.value)}
                          onCheckedChange={() => handleDocumentToggle("after", document.value)}
                        />
                        <Label
                          htmlFor={document.value}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {document.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Surveys Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Questionnaires</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openSurveyBuilder("after")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un questionnaire
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {surveys
                      .filter((survey) => survey.categories === "after")
                      .map((survey) => (
                        <div
                          key={survey.id}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">{survey.title}</p>
                              <p className="text-xs text-gray-500">
                                {survey.questions?.length || 0} question(s)
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSurvey(survey.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    {surveys.filter((survey) => survey.categories === "after").length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Aucun questionnaire créé pour cette catégorie
                      </p>
                    )}
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

      {/* Survey Question Builder */}
      <SurveyQuestionBuilder
        open={surveyBuilderOpen}
        onOpenChange={setSurveyBuilderOpen}
        sessionId={sessionId}
        category={selectedCategory}
        onSuccess={handleCreateSurvey}
      />
    </div>
  );
}
