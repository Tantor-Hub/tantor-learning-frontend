export enum ITrainingType {
  EN_LIGNE = "En ligne",
  VISION_CONFERENCE = "Vision Conférence",
  PRESENTIEL = "En présentiel",
  HYBRIDE = "Hybride",
}

export interface ICategory {
  id: number;
  category: string;
}

export interface ITraining {
  id: string;
  title: string;
  subtitle: string;
  id_trainingcategory: string;
  trainingtype: ITrainingType;
  rnc: string;
  description: string;
  requirement: string;
  pedagogygoals: string;
  prix: number;
  createdAt: string;
  updatedAt: string;
  trainingCategory?: {
    title: string;
  };
}

// List all Training Api Response
export interface ITrainingListResponse {
  status: number;
  message: string;
  data: ITraining[];
}

export interface ICreateTrainingRequest {
  title: string;
  subtitle: string;
  id_trainingcategory: string;
  trainingtype: ITrainingType;
  rnc: string;
  description: string;
  requirement: string;
  pedagogygoals: string;
  prix: number;
}

export interface IUpdateTrainingRequest {
  id: string;
  title?: string;
  subtitle?: string;
  id_trainingcategory?: string;
  trainingtype?: ITrainingType;
  rnc?: string;
  description?: string;
  requirement?: string;
  pedagogygoals?: string;
  prix?: number;
}

// List all Training By ID Api Response -> get its sessions

export interface IListTrainingByIdResponse {
  status: number;
  message: string;
  data: ITraining;
}

interface FormationData {
  id: number;
  titre: string;
  sous_titre: string;
  id_category: number;
  id_thematic: number | null;
  rnc: string | null;
  description: string;
  prerequis: string | null;
  alternance: boolean | null;
  status: number;
  createdAt: string;
  updatedAt: string;
  Category: Category;
  Sessions: ISession[];
}

interface Category {
  id: number;
  category: string;
}

export interface ISession {
  id: string;
  id_trainings?: string;
  title: string;
  nb_places: number;
  available_places: number;
  required_document?: string[];
  payment_method?: string[];
  survey?: string[];
  regulation_text: string;
  begining_date: Date;
  ending_date: Date;
  createdAt?: Date;
  updatedAt?: Date;
  trainings?: {
    title: string;
    subtitle: string;
    description: string;
  };
}

// Training Types

export interface ITrainingTypesResponse {
  status: number;
  message: string;
  data: {
    key: string;
    type: string;
    description: string;
  }[];
}

export interface ITrainingCategory {
  id: string;
  title: string;
  description: string;
}

export interface IListCategoryTrainingResponse {
  status: number;
  message: string;
  data: ITrainingCategory[];
}

export interface IListCourseBySessionIdResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: number;
      id_preset_cours: number;
      duree: number | null;
      ponderation: number | null;
      is_published: boolean;
      createdBy: number;
      id_session: number;
      id_category: number;
      id_formateur: number | null;
      Session: {
        designation: string;
        duree: string;
        type_formation: string;
      };
      CreatedBy: {
        id: number;
        fs_name: string;
        ls_name: string;
        email: string;
      };
      Title: {
        id: number;
        title: string;
        description: string;
      };
    }>;
  };
}

export interface IListSessionByTrainingIdResponse {
  status: number;
  message: string;
  data: ISession[];
}

export interface ICreateSessionRequest {
  id_trainings: string; // Required (UUID of the training)
  title: string; // Required
  nb_places: number; // Required (minimum: 1)
  available_places: number; // Required (minimum: 0)
  required_document?: string[]; // Optional
  payment_method?: string[]; // Optional
  survey?: string[]; // Optional
  regulation_text: string; // Required
  begining_date: string; // Required (ISO date string)
  ending_date: string; // Required (ISO date string)
}

export interface ICourseBySessionIdResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: string;
      title: string;
      description: string;
      is_published: boolean;
      id_formateur: string[] | null;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}

export interface ICourseItem {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  id_formateur: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseUpdateResponse {
  status: number;
  message: string;
  data: ICourseItem;
}
