export type CPFPaymentStatus = "pending" | "rejected" | "validated";

export interface CPFPayment {
  userId: string;
  userEmail: string;
  sessionId: string;
  sessionTitle: string;
  status: CPFPaymentStatus;
  cpfLink: string;
}

export interface CPFPaymentResponse {
  status: number;
  message: string;
  data: CPFPayment[];
}

export interface UpdateCPFStatusRequest {
  userId: string;
  sessionId: string;
  status: CPFPaymentStatus;
}

export interface UpdateCPFStatusResponse {
  status: number;
  message: string;
  data: {
    userId: string;
    sessionId: string;
    status: CPFPaymentStatus;
  };
}

export interface CreateCPFPaymentRequest {
  id_session: string;
}

export interface CreateCPFPaymentResponse {
  status: number;
  message: string;
  data: {
    id: string;
    id_session: string;
    userId: string;
    status: CPFPaymentStatus;
    createdAt: string;
  };
}
