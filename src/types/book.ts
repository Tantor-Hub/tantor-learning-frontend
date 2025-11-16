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
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  description: string;
  session: string[];
  author: string;
  status: "premium" | "free";
  category: string[];
  icon: File;
  piece_joint: File;
  public: boolean;
}

export interface UpdateBookRequest {
  title?: string;
  description?: string;
  session?: string[];
  author?: string;
  status?: "premium" | "free";
  category?: string[];
  icon?: File;
  piece_joint?: File;
  public?: boolean;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
}
