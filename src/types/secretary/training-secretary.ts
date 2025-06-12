export interface ICategory {
  id: number;
  category: string;
}

export interface ITraining {
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
  Category: ICategory;
  prix?: string;
  objectif?: string;
  id_formation?: number;
  FormationData: any;
  // FormationData?: { id_formation?: string; titre?: string };
  // seances?: any;
}

// List all Training Api Response
export interface ITrainingListResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: ITraining[];
  };
}

export interface IAddTrainingRequest {
  titre: string;
  sous_titre: string;
  type_formation: string;
  id_category: string;
  prix: string;
  rnc: string; // RNCP35526 -> number
  description: string;
  objectif: string;
  prerequis: string;
  alternance: string; // durree -> 3ans
}

// List all Training By ID Api Response -> get its sessions

export interface ITrainingByIdResponse {
  status: number;
  message: string;
  data: FormationData;
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
  id: number;
  uuid: string;
  designation: string;
  id_controleur: number | null;
  id_superviseur: number | null;
  date_mise_a_jour: string | null;
  duree: string;
  progression: number;
  id_formation: number;
  piece_jointe: string | null;
  type_formation: string;
  id_category: number;
  date_session_debut: string;
  date_session_fin: string;
  description: string | null;
  prix: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}
