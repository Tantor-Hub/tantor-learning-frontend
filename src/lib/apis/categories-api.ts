// File: src/lib/api/categories-api.ts
import { baseQuery, createApi } from "./base-api";

// Category related types
export interface Category {
  id_thematique: string;
  category: string;
  description: string;
  // Add other category properties
}

export interface CreateCategoryRequest {
  id_thematique: string;
  category: string;
  description: string;
  // Add other category creation fields
}

export interface UpdateCategoryRequest {
  id_thematique: string;
  category: string;
  description: string;
  // Add other category update fields
}

// Categories API
export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (categoryData) => ({
        url: "/api/categories/category/add",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    getAllCategories: builder.query<Category[], void>({
      query: () => "/api/categories/list",
      providesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { id_category: string; data: UpdateCategoryRequest }
    >({
      query: ({ id_category, data }) => ({
        url: `/api/categories/category/${id_category}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id_category) => ({
        url: `/api/categories/categorie/${id_category}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
