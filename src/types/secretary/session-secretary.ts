export interface IAddSessionRequest {
  id_formation: number;
  description: string;
  date_session_debut: string; // or Date if you prefer
  date_session_fin: string; // or Date if you prefer
  nb_places: number;
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
  text_reglement?: string;
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
  id_formation: number; // required
  descripiton: string;
  date_session_debut: string; //2025-04-23T08:00:00
  date_session_fin: string; // 2025-05-23T17:30:00
  prix: number;
  type_formation: string;
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
  CreatedBy: {
    id: number;
    fs_name: string;
    ls_name: string;
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
