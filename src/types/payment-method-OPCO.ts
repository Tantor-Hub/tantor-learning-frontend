export interface OPCOSPayment {
  id: string;
  userId: string;
  userEmail: string;
  sessionId: string;
  sessionTitle: string;
  status: string;
  paymentStatus: string;
  nomOpco?: string;
  nomEntreprise?: string;
  siren?: string;
}

export interface OPCOSPaymentResponse {
  status: number;
  message: string;
  data: OPCOSPayment[];
}

export interface UpdateOPCOStatusRequest {
  userId: string;
  sessionId: string;
  status: string;
}

export interface UpdateOPCOStatusResponse {
  status: number;
  message: string;
  data: OPCOSPayment;
}

export interface CreateOPCOSPaymentRequest {
  userId: string;
  sessionId: string;
  nomOpco?: string;
  nomEntreprise?: string;
  siren?: string;
}

export interface CreateOPCOSPaymentResponse {
  status: number;
  message: string;
  data: OPCOSPayment;
}

export interface UpdateOPCOPaymentRequest {
  id: string;
  nomOpco?: string;
  nomEntreprise?: string;
  siren?: string;
}

export interface UpdateOPCOPaymentResponse {
  status: number;
  message: string;
  data: OPCOSPayment;
}

export interface GetOPCOPaymentResponse {
  status: number;
  message: string;
  data: OPCOSPayment[];
}

export interface GetOPCOPaymentByIdResponse {
  status: number;
  message: string;
  data: {
    id: string;
    id_session: string;
    nom_opco: string | null;
    nom_entreprise: string;
    siren: string;
    nom_responsable: string;
    telephone_responsable: string;
    email_responsable: string;
    status: string;
    id_user: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    trainingSession: {
      id: string;
      title: string;
      nb_places: number;
      available_places: number;
      begining_date: string;
      ending_date: string;
    };
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
}

export type OPCOSPaymentStatus = "pending" | "validated" | "rejected";
