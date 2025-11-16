import { createApi, enhancedBaseQuery } from "./base-api";
import {
  BookCategory,
  CreateBookCategoryRequest,
  UpdateBookCategoryRequest,
} from "@/types/bookcategory";

export const bookCategoryApi = createApi({
  reducerPath: "bookCategoryApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["BookCategory"],
  endpoints: (builder) => ({
    getBookCategories: builder.query<{ status: number; data: BookCategory[] }, void>({
      query: () => "bookcategory",
      providesTags: ["BookCategory"],
    }),
    getBookCategory: builder.query<{ status: number; data: BookCategory }, string>({
      query: (id) => `bookcategory/${id}`,
      providesTags: (result, error, id) => [{ type: "BookCategory", id }],
    }),
    createBookCategory: builder.mutation<
      { status: number; data: BookCategory },
      CreateBookCategoryRequest
    >({
      query: (body) => ({
        url: "bookcategory",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BookCategory"],
    }),
    updateBookCategory: builder.mutation<
      { status: number; data: BookCategory },
      { id: string; body: UpdateBookCategoryRequest }
    >({
      query: ({ id, body }) => ({
        url: `bookcategory/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "BookCategory", id }],
    }),
    deleteBookCategory: builder.mutation<{ status: number; data?: any }, string>({
      query: (id) => ({
        url: `bookcategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "BookCategory", id }],
    }),
  }),
});

export const {
  useGetBookCategoriesQuery,
  useLazyGetBookCategoriesQuery,
  useGetBookCategoryQuery,
  useCreateBookCategoryMutation,
  useUpdateBookCategoryMutation,
  useDeleteBookCategoryMutation,
} = bookCategoryApi;
