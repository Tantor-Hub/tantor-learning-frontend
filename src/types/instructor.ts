export interface IAddMatiere {
  title: string;
  description: string;
  id_session: string;
}

export interface IListAllCoursesResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: string;
      title: string;
      description: string;
      is_published: boolean;
      id_formateur: string[];
      id_session: string;
      createdBy: string;
      createdAt: string;
      updatedAt: string;
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
        begining_date: string;
        ending_date: string;
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
      firstName: string;
      lastName: string;
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
        firstName: string;
        lastName: string;
        email: string;
      }>;
    }>;
  };
}

// Lesson types
export interface ILesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  is_published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ILessonsResponse {
  status: number;
  message: string;
  data: {
    length: number;
    rows: ILesson[];
  };
}

export interface ILessonDetail {
  id: string;
  title: string;
  description: string;
  id_cours: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILessonDetailResponse {
  status: number;
  data: ILessonDetail;
}

export interface ICreateLessonRequest {
  title: string;
  description: string;
  id_cours: string;
}
