export interface IAddMatiere {
  title: string;
  description: string;
  id_session: number;
  id_formateurs?: number[];
  is_published?: boolean;
}

export interface IListAllCoursesResponse {
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

export interface IGetCourseByIdResponse {
  status: number;
  message: string;
  data: {
    id: number;
    id_preset_cours: number;
    duree: null | string;
    ponderation: null | number;
    is_published: boolean;
    createdBy: number;
    id_session: number;
    id_category: number;
    id_formateur: number;
    Chapitres: {
      id: number;
      chapitre: string;
      id_cours: number;
      paragraphes: string[];
    }[];
    Documents: {
      id: number;
      file_name: string;
      url: string;
      type: string;
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

export interface ICourse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
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
    }>;
  };
}
