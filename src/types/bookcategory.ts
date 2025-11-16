export interface BookCategory {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookCategoryRequest {
  title: string;
}

export interface UpdateBookCategoryRequest {
  title: string;
}
