"use client";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Plus,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Upload,
  CreditCard,
  Building,
  User,
  Euro,
  X,
} from "lucide-react";
import { useAddSessionMutation } from "@/lib/apis/secretary/session-secretary-api";
import { useListTrainingTypeQuery } from "@/lib/apis/secretary/training-secretary-api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";

interface SessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  trainingId: string;
  children: ReactNode;
}

const DOCUMENT_TYPES = [
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
  { value: "FICHE_CONTROLE_INITIALE", label: "Fiche de contrôle initiale" },
];

const FINANCEMENT_OPTIONS = [
  {
    value: "fonds_propres",
    label: "Fonds propres",
    description: "Paiement personnel de l'étudiant",
    icon: User,
  },
  {
    value: "opco",
    label: "OPCO",
    description: "Opérateur de compétences (financement employeur)",
    icon: Building,
  },
  {
    value: "cpf",
    label: "CPF",
    description: "Compte Personnel de Formation",
    icon: Euro,
  },
];

type Question = {
  id: string;
  text: string;
  type: "text" | "radio" | "checkbox";
  options?: string[];
  required: boolean;
};

interface SessionFormState {
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  prix: string;
  type_formation: string;
  questions: Question[];
  documents_requis: string[];
  conditions_generales: string;
  financement: string[];
}

const SessionForm: React.FC<SessionFormProps> = ({ open, onOpenChange, onSuccess, trainingId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [form, setForm] = useState<SessionFormState>({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    prix: "900",
    type_formation: "onLine",
    questions: [],
    documents_requis: [],
    conditions_generales: "",
    financement: [],
  });

  const [addSessionMutation, { isLoading }] = useAddSessionMutation();
  const { data: trainingTypes, isLoading: isTrainingTypesLoading } = useListTrainingTypeQuery();

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: uuidv4(),
          text: "",
          type: "text",
          options: [],
          required: false,
        },
      ],
    }));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    }));
  };

  const removeQuestion = (id: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const addOption = (questionId: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), ""],
            }
          : q
      ),
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions.splice(optionIndex, 1);
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedQuestions = form.questions.map((q) => ({
        question: q.text,
        type: q.type,
        options: q.options || [],
        required: q.required,
      }));

      console.log("Informations de la session créée:", {
        ...form,
        questions: formattedQuestions,
      });
      const promise = await addSessionMutation({
        id_formation: trainingId,
        descripiton: form.description,
        date_session_debut: form.date_debut,
        date_session_fin: form.date_fin,
        prix: form.prix,
        type_formation: form.type_formation,
        // questions: formattedQuestions,
        // documents_requis: form.documents_requis,
        // conditions_generales: form.conditions_generales,
        // financement: form.financement,
      }).unwrap();

      onSuccess();
      toast.success("Session créée avec succès", {
        description: "La nouvelle session a été créée et configurée.",
      });

      // Reset form
      setForm({
        titre: "",
        description: "",
        date_debut: "",
        date_fin: "",
        prix: "900",
        type_formation: "onLine",
        questions: [],
        documents_requis: [],
        conditions_generales: "",
        financement: [],
      });
      setCurrentStep(1);
      onOpenChange(false);

      console.log("Informations de la session créée:", {
        ...form,
        questions: formattedQuestions,
      });
    } catch (error) {
      toast.error("Erreur lors de la création", {
        description: "Une erreur est survenue lors de la création de la session.",
      });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleDocumentToggle = (documentValue: string) => {
    setForm((prev) => ({
      ...prev,
      documents_requis: prev.documents_requis.includes(documentValue)
        ? prev.documents_requis.filter((doc) => doc !== documentValue)
        : [...prev.documents_requis, documentValue],
    }));
  };

  const handleFinancementToggle = (financementValue: string) => {
    setForm((prev) => ({
      ...prev,
      financement: prev.financement.includes(financementValue)
        ? prev.financement.filter((fin) => fin !== financementValue)
        : [...prev.financement, financementValue],
    }));
  };

  const getProgressWidth = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* En-tête avec progression */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 -mx-6 -mt-6 mb-6 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Nouvelle Session de Formation
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Créez une nouvelle session étape par étape
            </DialogDescription>
          </DialogHeader>

          {/* Barre de progression */}
          <div className="mt-4 relative">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 ${
                    step <= currentStep
                      ? "bg-white text-blue-600 transform scale-110"
                      : "bg-blue-500 text-white"
                  } transition-all duration-300`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div
              className="absolute top-4 left-0 h-1 bg-blue-400 rounded-full"
              style={{ width: "100%" }}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${getProgressWidth()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Étape 1: Informations de base */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de base</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="titre">Titre de la session</Label>
                <Input
                  id="titre"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Ex: Introduction à NestJS - Session Intensive"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez le contenu et les objectifs de cette session..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_debut">Date de début</Label>
                  <Input
                    id="date_debut"
                    type="date"
                    value={form.date_debut}
                    onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date_fin">Date de fin</Label>
                  <Input
                    id="date_fin"
                    type="date"
                    value={form.date_fin}
                    onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 2: Questions aux étudiants */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Questions pour les étudiants
            </h3>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Questions d'inscription</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Ajoutez des questions que les étudiants devront répondre lors de leur inscription
              </p>

              <div className="space-y-4">
                {form.questions.map((question) => (
                  <div key={question.id} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <Input
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                        placeholder="Entrez votre question"
                        className="flex-1 mr-2"
                      />
                      <Select
                        value={question.type}
                        onValueChange={(value) => updateQuestion(question.id, "type", value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Type de réponse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texte libre</SelectItem>
                          <SelectItem value="radio">Choix unique</SelectItem>
                          <SelectItem value="checkbox">Choix multiple</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 text-red-500 hover:text-red-600"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id={`required-${question.id}`}
                        checked={question.required}
                        onCheckedChange={(checked) =>
                          updateQuestion(question.id, "required", checked)
                        }
                      />
                      <Label htmlFor={`required-${question.id}`}>Réponse obligatoire</Label>
                    </div>

                    {(question.type === "radio" || question.type === "checkbox") && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Options de réponse</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(question.id)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Ajouter une option
                          </Button>
                        </div>

                        {question.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(question.id, index)}
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-2" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une question
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                💡 Ces questions vous aideront à mieux connaître vos étudiants et adapter votre
                enseignement.
              </p>
            </div>
          </div>
        )}

        {/* Étape 3: Documents requis */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents requis</h3>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">Documents d'inscription</span>
              </div>
              <p className="text-sm text-amber-700">
                Sélectionnez les documents que les étudiants devront fournir lors de leur
                inscription
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DOCUMENT_TYPES.map((document) => (
                <div
                  key={document.value}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                >
                  <Checkbox
                    id={document.value}
                    checked={form.documents_requis.includes(document.value)}
                    onCheckedChange={() => handleDocumentToggle(document.value)}
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

            <div className="text-sm text-gray-600 mt-4">
              <p>📋 Documents sélectionnés: {form.documents_requis.length}</p>
            </div>
          </div>
        )}

        {/* Étape 4: Conditions générales */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conditions générales</h3>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800">Conditions de participation</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Définissez les conditions générales de participation à cette session
              </p>
              <Textarea
                value={form.conditions_generales}
                onChange={(e) => setForm({ ...form, conditions_generales: e.target.value })}
                placeholder="Ex: Les participants doivent avoir un niveau minimum en programmation. L'assiduité est obligatoire. Les absences doivent être justifiées..."
                rows={6}
                className="bg-white"
              />
            </div>

            <div className="text-sm text-gray-600">
              <p>
                ⚖️ Ces conditions seront affichées lors de l'inscription et devront être acceptées
                par les étudiants.
              </p>
            </div>
          </div>
        )}

        {/* Étape 5: Options de financement */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Options de financement acceptées
            </h3>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Modes de financement</span>
              </div>
              <p className="text-sm text-green-700">
                Sélectionnez les options de financement que vous acceptez pour cette formation
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {FINANCEMENT_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      form.financement.includes(option.value)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleFinancementToggle(option.value)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={form.financement.includes(option.value)}
                            aria-readonly
                          />
                          <span className="font-medium text-gray-800">{option.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Les étudiants pourront choisir leur mode de financement
                préféré lors de l'inscription, parmi ceux que vous avez sélectionnés.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Étape {currentStep} sur {totalSteps}
            </span>
          </div>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep} className="flex items-center gap-2">
              Continuer
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Créer la session
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionForm;
