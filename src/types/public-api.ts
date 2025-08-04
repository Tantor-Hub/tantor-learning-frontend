export interface ISubscribeNewsLetterRequest {
  user_email: string;
}

export interface ISubscribeNewsLetterResponse {
  status: number;
  message: string;
}

export interface IGetAllTrainingsResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: Array<{
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
      Formation: {
        id: number;
        titre: string;
        sous_titre: string;
        description: string;
      };
    }>;
  };
}

export interface IContactFormRequest {
  from_name: string;
  from_mail: string;
  subject: string;
  content: string;
}

export interface IContactFormResponse {
  status: number;
  message: string;
}

// Response Library

export interface ILibraryResponse {
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

// Formation Response

export interface IListFormationResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: {
      id: number;
      titre: string;
      sous_titre: string;
      id_category: number;
      id_thematic: number | null;
      type_formation: string;
      rnc: string;
      description: string;
      prerequis: string;
      alternance: string;
      status: number;
      prix: number;
      createdAt: string;
      updatedAt: string;
      Category: {
        id: number;
        category: string;
      };
    }[];
  };
}

export interface IListSessionsByFormationIdResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: Array<{
      id: number;
      uuid: string;
      designation: string;
      id_controleur: number | null;
      createdBy: number | null;
      id_superviseur: number[] | null;
      date_mise_a_jour: string | null;
      duree: string;
      text_reglement: string;
      payment_methods: string[];
      required_documents: string[];
      nb_places: number;
      nb_places_disponible: number;
      progression: number;
      id_formation: number;
      piece_jointe: string | null;
      type_formation: string;
      id_category: number;
      date_session_debut: string;
      date_session_fin: string;
      description: string | null;
      prix: number | null;
      initial_price: number | null;
      status: number;
      createdAt: string;
      updatedAt: string;
      Formation: {
        id: number;
        titre: string;
        sous_titre: string;
        description: string;
      };
      Creator: {
        id: number;
        fs_name: string;
        ls_name: string;
        email: string;
      } | null;
      Cours: Array<{
        id: number;
        id_preset_cours: number;
        duree: number;
        ponderation: number;
        is_published: boolean;
        createdBy: number;
        id_session: number;
        id_formateur: number;
        Title: {
          id: number;
          title: string;
          description: string;
        };
      }>;
    }>;
  };
}

// GET SESSION BY ID

export interface IGetSessionByIdResponse {
  status: number;
  message: string;
  data: {
    id: number;
    uuid: string;
    designation: string;
    id_controleur: number | null;
    createdBy: number | null;
    id_superviseur: number | null;
    date_mise_a_jour: string | null;
    duree: string;
    text_reglement: string;
    payment_methods: string[];
    required_documents: string[];
    nb_places: number;
    nb_places_disponible: number;
    progression: number;
    id_formation: number;
    piece_jointe: string | null;
    type_formation: string;
    id_category: number;
    date_session_debut: string;
    date_session_fin: string;
    description: string | null;
    prix: number;
    initial_price: number | null;
    status: number;
    createdAt: string;
    updatedAt: string;
    Formation: {
      id: number;
      titre: string;
      sous_titre: string;
      description: string;
    };
    Surveys: {
      id: number;
      id_session: number;
      description: string;
      created_by: number;
      createdAt: string;
      updatedAt: string;
      Questionnaires: {
        id: number;
        titre: string;
        is_required: boolean;
        description: string;
        type: string;
        id_questionnaire: number;
        id_session: number | null;
        createdAt: string;
        updatedAt: string;
        Options: {
          id: number;
          id_question: number;
          text: string;
          is_correct: boolean;
          createdAt: string;
          updatedAt: string;
        }[];
      }[];
    }[];
    Creator: null;
    Cours: {
      id: number;
      id_preset_cours: number;
      duree: number | null;
      ponderation: number | null;
      is_published: boolean;
      createdBy: number;
      id_session: number;
      id_formateur: number | null;
      Title: {
        id: number;
        title: string;
        description: string;
      };
    }[];
  };
}
