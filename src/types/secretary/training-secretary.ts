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
  seances?: any;
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
