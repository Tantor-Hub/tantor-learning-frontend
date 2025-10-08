export interface IAddSessionRequest {
  id_trainings: string;
  title: string;
  nb_places: number;
  begining_date: string;
  ending_date: string;
  regulation_text: string;
  payment_methods?: string[]; //"OPCO" | "CPF" | "CARD";
  required_documents?: string[];
  // required_documents: Array<
  //   | "CARTE_IDENTITE"
  //   | "CONTRAT_OU_CONVENTION"
  //   | "JUSTIFICATIF_DOMICILE"
  //   | "ANALYSE_BESOIN"
  //   | "FORMULAIRE_HANDICAP"
  //   | "CONVOCATION"
  //   | "PROGRAMME"
  //   | "CONDITIONS_VENTE"
  //   | "REGLEMENT_INTERIEUR"
  //   | "CGV"
  // >;
  questions?: Array<{
    titre: string;
    description: string;
    is_required: boolean;
    type_question: "QCM" | "TXT" | "QCU";
    options?: Array<{
      text: string;
      is_correct?: boolean;
    }>;
  }>;
}

export interface IUpdateSessionRequest {
  id: string; // required
  id_trainings?: string;
  title?: string;
  nb_places?: number;
  required_document_before?: string[];
  required_document_during?: string[];
  required_document_after?: string[];
  payment_method?: string[];
  survey?: string[];
  regulation_text?: string;
  begining_date?: string;
  ending_date?: string;
}

export interface IUpdateSessionPaymentRequest {
  id: string; // Required: Training session UUID
  payment_method?: string[]; // Optional: Array of payment methods
  cpf_link?: string; // Optional: CPF payment link
}

export interface ISession {
  id: string;
  title: string;
  description: string;
  is_published: true;
  id_session: string;
  id_formateur: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  cpf_link?: string;
  CreatedBy: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  trainingSession: {
    id: string;
    title: string;
    nb_places: number;
    available_places: number;
    begining_date: Date;
    ending_date: Date;
  };
}
export interface IListSessionResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: ISession[];
  };
}

export interface ISessionByIdResponse {
  status: number;
  message: string;
  data: {
    id: string;
    id_trainings: string;
    title: string;
    nb_places: number;
    available_places: number;
    required_document_before: string[];
    required_document_during: string[];
    required_document_after: string[];
    payment_method: string[];
    survey: string[];
    regulation_text: string;
    begining_date: string;
    ending_date: string;
    cpf_link?: string;
    createdAt: string;
    updatedAt: string;
    trainings: {
      id: string;
      title: string;
      subtitle: string;
      description: string;
      trainingtype: string;
      prix: string;
    };
  };
}

// Survey Question Types - Updated to match backend structure
export interface QuestionOption {
  id: string;
  text: string;
}

export interface SurveyQuestionData {
  id: string;
  type: "multiple_choice" | "text";
  question: string;
  options?: QuestionOption[]; // Only for multiple choice questions
  required: boolean;
  order: number;
  maxSelections?: number; // For multiple choice: how many options can be selected
}

export interface ICreateSurveyRequest {
  title: string;
  id_session: string;
  categories: "before" | "during" | "after";
  questions: SurveyQuestionData[];
}

export interface ISurveyResponse {
  id: string;
  title: string;
  id_session: string;
  categories: "before" | "during" | "after";
  questions: SurveyQuestionData[];
  createdBy: string;
  creator?: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IListSurveysResponse {
  status: number;
  message: string;
  data: {
    surveys: ISurveyResponse[];
  };
}
