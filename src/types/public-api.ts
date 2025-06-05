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
