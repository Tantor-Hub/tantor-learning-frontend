export interface Book {
  id: string;
  title: string;
  description: string;
  session: string[];
  author: string;
  createby: string;
  status: "premium" | "free";
  category: string[];
  icon: string;
  piece_joint: string;
  views: number;
  download: number;
  public?: boolean;
  downloadable?: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateBookRequest {
  title: string;
  description: string;
  session: string[];
  author: string;
  status: "premium" | "free";
  category: string[];
  icon: string; // URL after upload
  piece_joint: string; // URL after upload
  public: boolean;
  downloadable?: boolean;
}

export interface UpdateBookRequest {
  title?: string;
  description?: string;
  session?: string[];
  author?: string;
  status?: "premium" | "free";
  category?: string[];
  icon?: string; // URL after upload
  piece_joint?: string; // URL after upload
  public?: boolean;
  downloadable?: boolean;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
}
