export type OPCOSPaymentStatus = "pending" | "rejected" | "validated";

export interface OPCOSPayment {
  userId: string;
  userEmail: string;
  sessionId: string;
  sessionTitle: string;
  status: OPCOSPaymentStatus;
  paymentStatus: OPCOSPaymentStatus;
  nomOpco: string;
  nomEntreprise: string;
  siren: string;
}

export interface OPCOSPaymentResponse {
  status: number;
  message: string;
  data: OPCOSPayment[];
}

export interface UpdateOPCOSStatusRequest {
  userId: string;
  sessionId: string;
  status: OPCOSPaymentStatus;
}

export interface UpdateOPCOSStatusResponse {
  status: number;
  message: string;
  data: {
    userId: string;
    sessionId: string;
    status: OPCOSPaymentStatus;
  };
}

export interface CreateOPCOSPaymentRequest {
  id_session: string;
  nom_entreprise: string;
  siren: string;
  nom_responsable: string;
  telephone_responsable: string;
  email_responsable: string;
}

export interface CreateOPCOSPaymentResponse {
  status: number;
  message: string;
  data: {
    id: string;
    id_session: string;
    userId: string;
    nom_entreprise: string;
    siren: string;
    nom_responsable: string;
    telephone_responsable: string;
    email_responsable: string;
    status: OPCOSPaymentStatus;
    createdAt: string;
  };
}
