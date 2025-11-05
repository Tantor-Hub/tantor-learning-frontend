export interface SessionDocument {
  id: string;
  type: string;
  id_student: string;
  id_session: string;
  categories: "before" | "during" | "after";
  piece_jointe: string;
  status: string;
  student?: {
    uuid: string;
    fs_name: string;
    ls_name: string;
    email: string;
  };
  trainingSession?: {
    id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface CreateSessionDocumentRequest {
  type: string;
  id_session: string;
  categories: "before" | "during" | "after";
  piece_jointe: File;
}

export interface UpdateSessionDocumentRequest {
  status: "pending" | "rejected" | "validated";
}
