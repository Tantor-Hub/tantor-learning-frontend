import { createApi, enhancedBaseQuery } from "./base-api";
import { Book, CreateBookRequest, UpdateBookRequest, ApiResponse } from "@/types/book";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: enhancedBaseQuery,
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
    createBook: builder.mutation<Book, CreateBookRequest>({
      query: (body) => ({
        url: "book",
        method: "POST",
        body,
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
    updateBook: builder.mutation<Book, { id: string; body: UpdateBookRequest }>({
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
  }),
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useGetBookByIdQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;
