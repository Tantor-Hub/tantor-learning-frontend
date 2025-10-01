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

export interface IApplyToTrainingRequest {
  id_session: number;
  responses_survey?: {
    id_question: number;
    answer: string;
  }[];
  roi_accepted: boolean;
  payment: {
    method: "CARD" | "OPCO" | "CPF";
    card?: {
      full_name: string;
      card_number: string;
      cvv: number;
      year: number;
      month: number;
      id_stripe_payment: string;
    };
    opco?: {
      nom_opco?: string;
      nom_entreprise: string;
      siren: string;
      nom_responsable: string;
      telephone_responsable: string;
      email_responsable: string;
    };
    cpf?: {
      full_name: string;
    };
  };
}

export interface ISessionDetailsResponse {
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
    Creator: any | null;
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

export interface IListCourses {
  status: number;
  message: string;
  data: {
    length: number;
    rows: Array<{
      id: number;
      id_preset_cours: number;
      duree: null | string;
      ponderation: null | number;
      is_published: boolean;
      createdBy: number;
      id_session: number;
      id_category: number;
      id_formateur: number;
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
    }>;
  };
}

export interface IGetMySessionsResponse {
  status: number;
  message: string;
  data: {
    length: number;
    list: Array<{
      id: number;
      id_controleur: number | null;
      id_superviseur: number[] | null;
      date_mise_a_jour: string;
      id_formation: number;
      is_started: number;
      id_sessionsuivi: number;
      id_seances: number | null;
      id_stagiaire: number;
      id_payement: number | null;
      status: number | null;
      createdAt: string;
      updatedAt: string;
      Session: {
        id: number;
        uuid: string;
        designation: string;
        id_controleur: number | null;
        createdBy: number | null;
        id_superviseur: number[] | null;
        date_mise_a_jour: string | null;
        duree: string;
        progression: number;
        id_formation: number;
        piece_jointe: string | null;
        type_formation: "onLine" | "presentiel" | "hybride";
        id_category: number;
        date_session_debut: string;
        date_session_fin: string;
        description: string | null;
        prix: number;
        status: number;
        createdAt: string;
        updatedAt: string;
      };
      Formation: {
        id: number;
        titre: string;
        sous_titre: string;
        description: string;
      };
    }>;
  };
}

export interface ICoursDetailsResponse {
  status: number;
  message: string;
  data: {
    id: number;
    id_preset_cours: number;
    duree: string | null;
    ponderation: string | null;
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
