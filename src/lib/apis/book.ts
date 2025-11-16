import { createApi, fileUploadEnhancedBaseQuery } from "./base-api";
import { Book, CreateBookRequest, UpdateBookRequest, ApiResponse } from "@/types/book";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fileUploadEnhancedBaseQuery,
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], void>({
      query: () => ({
        url: "book",
        method: "GET",
      }),
      providesTags: ["Book"],
      transformResponse: (response: ApiResponse<Book[]>) => response.data,
    }),
    createBook: builder.mutation<Book, FormData>({
      query: (formData) => ({
        url: "book",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Book"],
      transformResponse: (response: ApiResponse<Book>) => response.data,
    }),
    getBookById: builder.query<Book, string>({
      query: (id) => ({
        url: `book/${id}`,
        method: "GET",
      }),
      providesTags: ["Book"],
      transformResponse: (response: ApiResponse<Book>) => response.data,
    }),
    updateBook: builder.mutation<Book, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `book/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Book"],
      transformResponse: (response: ApiResponse<Book>) => response.data,
    }),
    deleteBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `book/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
    incrementBookViews: builder.mutation<Book, string>({
      query: (id) => ({
        url: `book/${id}/views`,
        method: "POST",
      }),
      invalidatesTags: ["Book"],
      transformResponse: (response: ApiResponse<Book>) => response.data,
    }),
    incrementBookDownloads: builder.mutation<Book, string>({
      query: (id) => ({
        url: `book/${id}/downloads`,
        method: "POST",
      }),
      invalidatesTags: ["Book"],
      transformResponse: (response: ApiResponse<Book>) => response.data,
    }),
  }),
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useGetBookByIdQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useIncrementBookViewsMutation,
  useIncrementBookDownloadsMutation,
} = bookApi;
