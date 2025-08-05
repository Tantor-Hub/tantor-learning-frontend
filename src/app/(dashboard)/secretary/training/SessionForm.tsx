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
  CreditCard,
  Building,
  User,
  Euro,
  X,
} from "lucide-react";
import { useAddSessionMutation } from "@/lib/apis/secretary/session-secretary-api";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { IAddSessionRequest } from "@/types/secretary/session-secretary";

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
];

const PAYMENT_METHODS = [
  {
    value: "CARD",
    label: "Fonds propres",
    description: "Paiement personnel de l'étudiant",
    icon: User,
  },
  {
    value: "OPCO",
    label: "OPCO",
    description: "Opérateur de compétences (financement employeur)",
    icon: Building,
  },
  {
    value: "CPF",
    label: "CPF",
    description: "Compte Personnel de Formation",
    icon: Euro,
  },
];

type Question = {
  id: string;
  titre: string;
  description: string;
  type_question: "QCM" | "TEXTE_LIBRE" | "QCU";
  options: Array<{ text: string; is_correct?: boolean }>;
  is_required: boolean;
};

interface SessionFormState {
  description: string;
  date_session_debut: string;
  date_session_fin: string;
  nb_places: string;
  payment_methods: string[];
  questions: Question[];
  required_documents: string[];
  text_reglement: string;
}

const SessionForm: React.FC<SessionFormProps> = ({ open, onOpenChange, onSuccess, trainingId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [form, setForm] = useState<SessionFormState>({
    description: "",
    date_session_debut: "",
    date_session_fin: "",
    nb_places: "",
    payment_methods: [],
    questions: [],
    required_documents: [],
    text_reglement: "",
  });

  const [addSessionMutation, { isLoading }] = useAddSessionMutation();

  const isStep1Valid = () => {
    return (
      form.description.trim() !== "" &&
      form.date_session_debut !== "" &&
      form.date_session_fin !== "" &&
      form.nb_places.trim() !== "" &&
      parseInt(form.nb_places) > 0
    );
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: uuidv4(),
          titre: "",
          description: "",
          type_question: "TEXTE_LIBRE",
          options: [],
          is_required: false,
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
              options: [...q.options, { text: "", is_correct: false }],
            }
          : q
      ),
    }));
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    field: "text" | "is_correct",
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
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
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions.splice(optionIndex, 1);
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  const handlePaymentMethodToggle = (paymentMethod: string) => {
    setForm((prev) => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(paymentMethod)
        ? prev.payment_methods.filter((method) => method !== paymentMethod)
        : [...prev.payment_methods, paymentMethod],
    }));
  };

  const handleSubmit = async () => {
    try {
      // Build the payload according to API structure
      const payload: IAddSessionRequest = {
        id_formation: parseInt(trainingId),
        description: form.description,
        date_session_debut: form.date_session_debut + "T08:00:00",
        date_session_fin: form.date_session_fin + "T17:30:00",
        nb_places: parseInt(form.nb_places),
        required_documents: [],
        payment_methods: [],
        text_reglement: "",
      };

      // Only include optional fields if they have values
      if (form.payment_methods.length > 0) {
        payload.payment_methods = form.payment_methods;
      }

      if (form.required_documents.length > 0) {
        payload.required_documents = form.required_documents;
      }

      if (form.text_reglement.trim() !== "") {
        payload.text_reglement = form.text_reglement;
      }

      if (form.questions.length > 0) {
        // Filter out incomplete questions and format them properly
        const validQuestions = form.questions
          .filter((q) => q.titre.trim() !== "") // Only include questions with titles
          .map((q) => {
            const questionData: any = {
              titre: q.titre,
              description: q.description || "",
              is_required: q.is_required,
              type_question: q.type_question,
            };

            // Only include options for QCM and QCU questions
            if ((q.type_question === "QCM" || q.type_question === "QCU") && q.options.length > 0) {
              // Filter out empty options
              const validOptions = q.options.filter((option) => option.text.trim() !== "");
              if (validOptions.length > 0) {
                questionData.options = validOptions;
              }
            }

            return questionData;
          });

        if (validQuestions.length > 0) {
          payload.questions = validQuestions;
        }
      }

      console.log("Données envoyées:", payload);

      await addSessionMutation(payload).unwrap();

      onSuccess();
      toast.success("Session créée avec succès");

      // Reset form
      setForm({
        description: "",
        date_session_debut: "",
        date_session_fin: "",
        nb_places: "",
        payment_methods: [],
        questions: [],
        required_documents: [],
        text_reglement: "",
      });
      setCurrentStep(1);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création");
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

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
      required_documents: prev.required_documents.includes(documentValue)
        ? prev.required_documents.filter((doc) => doc !== documentValue)
        : [...prev.required_documents, documentValue],
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
        <div className="bg-gradient-to-r from-blue-600 to-primary -mx-6 -mt-6 mb-6 p-6 text-white">
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informations de base <span className="text-red-500">*</span>
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez le contenu et les objectifs de cette session..."
                  rows={3}
                  className={form.description.trim() === "" ? "border-red-300" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_session_debut">
                    Date de début <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date_session_debut"
                    type="date"
                    value={form.date_session_debut}
                    onChange={(e) => setForm({ ...form, date_session_debut: e.target.value })}
                    className={form.date_session_debut === "" ? "border-red-300" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="date_session_fin">
                    Date de fin <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date_session_fin"
                    type="date"
                    value={form.date_session_fin}
                    onChange={(e) => setForm({ ...form, date_session_fin: e.target.value })}
                    className={form.date_session_fin === "" ? "border-red-300" : ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nb_places">
                  Nombre de places <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nb_places"
                  type="number"
                  min="1"
                  className={`w-full ${form.nb_places.trim() === "" || parseInt(form.nb_places) <= 0 ? "border-red-300" : ""}`}
                  value={form.nb_places}
                  onChange={(e) => setForm({ ...form, nb_places: e.target.value })}
                  placeholder="Ex: 30"
                />
              </div>
            </div>

            {!isStep1Valid() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  ⚠️ Tous les champs marqués d'une étoile (*) sont obligatoires pour continuer.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Étape 2: Questions aux étudiants */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Questions pour les étudiants{" "}
              <span className="text-sm text-gray-500">(Optionnel)</span>
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
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={question.titre}
                            onChange={(e) => updateQuestion(question.id, "titre", e.target.value)}
                            placeholder="Titre de la question"
                            className="flex-1"
                          />
                          <Input
                            value={question.description}
                            onChange={(e) =>
                              updateQuestion(question.id, "description", e.target.value)
                            }
                            placeholder="Description (optionnelle)"
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <Select
                            value={question.type_question}
                            onValueChange={(value) =>
                              updateQuestion(question.id, "type_question", value)
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TEXTE_LIBRE">Texte libre</SelectItem>
                              <SelectItem value="QCU">Choix unique</SelectItem>
                              <SelectItem value="QCM">Choix multiple</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${question.id}`}
                          checked={question.is_required}
                          onCheckedChange={(checked) =>
                            updateQuestion(question.id, "is_required", checked)
                          }
                        />
                        <Label htmlFor={`required-${question.id}`}>Réponse obligatoire</Label>
                      </div>

                      {(question.type_question === "QCU" || question.type_question === "QCM") && (
                        <div className="space-y-2">
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

                          {question.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  updateOption(question.id, index, "text", e.target.value)
                                }
                                placeholder={`Option ${index + 1}`}
                                className="flex-1"
                              />
                              {question.type_question === "QCM" && (
                                <div className="flex items-center space-x-1">
                                  <Checkbox
                                    checked={option.is_correct || false}
                                    onCheckedChange={(checked) =>
                                      updateOption(question.id, index, "is_correct", checked)
                                    }
                                  />
                                  <Label className="text-xs">Correcte</Label>
                                </div>
                              )}
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
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-2" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une question
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Documents requis */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Documents requis <span className="text-sm text-gray-500">(Optionnel)</span>
            </h3>

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
                    checked={form.required_documents.includes(document.value)}
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
              <p>📋 Documents sélectionnés: {form.required_documents.length}</p>
            </div>
          </div>
        )}

        {/* Étape 4: Règlement intérieur */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Règlement intérieur <span className="text-sm text-gray-500">(Optionnel)</span>
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-800">Règlement de la session</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Définissez le règlement intérieur de cette session
              </p>
              <Textarea
                value={form.text_reglement}
                onChange={(e) => setForm({ ...form, text_reglement: e.target.value })}
                placeholder="Ex: Les participants doivent avoir un niveau minimum en programmation. L'assiduité est obligatoire. Les absences doivent être justifiées..."
                rows={6}
                className="bg-white"
              />
            </div>

            <div className="text-sm text-gray-600">
              <p>
                ⚖️ Ce règlement sera affiché lors de l'inscription et devra être accepté par les
                étudiants.
              </p>
            </div>
          </div>
        )}

        {/* Étape 5: Modes de paiement */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Modes de paiement acceptés <span className="text-sm text-gray-500">(Optionnel)</span>
            </h3>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Modes de financement</span>
              </div>
              <p className="text-sm text-green-700">
                Sélectionnez les modes de financement que vous acceptez pour cette formation
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {PAYMENT_METHODS.map((option) => {
                const IconComponent = option.icon;
                const isChecked = form.payment_methods.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isChecked
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePaymentMethodToggle(option.value)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => handlePaymentMethodToggle(option.value)}
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
                <strong>Modes sélectionnés:</strong>{" "}
                {form.payment_methods.length > 0
                  ? form.payment_methods.join(", ")
                  : "Aucun mode sélectionné"}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Vous pouvez sélectionner plusieurs modes de paiement pour offrir plus de flexibilité
                aux étudiants.
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
            <Button
              onClick={nextStep}
              disabled={currentStep === 1 && !isStep1Valid()}
              className="flex items-center gap-2"
            >
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
