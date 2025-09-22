export interface ICoursesAPIResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: number;
      title: string;
      description: string;
      createdBy: number;
      CreatedBy: {
        id: number;
        fs_name: string;
        ls_name: string;
        email: string;
      };
    }>;
  };
}

// MATIERES
// Add a document for a course

export interface IAddDocumentsForACourseRequest {
  document_name: string;
  piece_jointe: File;
  id_cours: string;
  id_session: string;
}

// Add a document for a course | Matieres

export interface ICourseContentRequest {
  id_cours: string;
  content: Array<{
    chapitre: string;
    paragraphes?: string[]; // Optional
  }>;
}

export interface ICourseContentResponse {
  status: number;
  message: string;
  data: {
    id: number;
    id_preset_cours: number;
    duree: number | null;
    ponderation: number | null;
    is_published: boolean;
    createdBy: number;
    id_session: number;
    id_category: number;
    id_formateur: number | null;
    Chapitres: {
      id: number;
      chapitre: string;
      id_cours: number;
      paragraphes: string[];
    }[];
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
  };
}

// Update course request interface
export interface IUpdateCourseRequest {
  id_cours: number;
  title: string;
  description: string;
  id_formateurs: number[];
}

// Update course response interface
export interface IUpdateCourseResponse {
  status: number;
  message: string;
  data: {
    id: number;
    title: string;
    description: string;
    is_published: boolean;
    id_formateurs: Array<{
      id: number;
      fs_name: string;
      ls_name: string;
      email: string;
    }>;
  };
}
