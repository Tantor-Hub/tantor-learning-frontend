import { createApi, fileUploadEnhancedBaseQuery } from "./base-api";
import { Book, CreateBookRequest, UpdateBookRequest, ApiResponse } from "@/types/book";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fileUploadEnhancedBaseQuery,
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooks: builder.query<
      { data: Book[]; totalPages: number; totalItems: number },
      {
        limit?: number;
        page?: number;
        minDownload?: number;
        minViews?: number;
        author?: string;
        category?: string;
        session?: string;
        search?: string;
        status?: string;
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.minDownload !== undefined)
          searchParams.append("minDownload", params.minDownload.toString());
        if (params.minViews !== undefined)
          searchParams.append("minViews", params.minViews.toString());
        if (params.author) searchParams.append("author", params.author);
        if (params.category) searchParams.append("category", params.category);
        if (params.session) searchParams.append("session", params.session);
        if (params.search) searchParams.append("search", params.search);
        if (params.status) searchParams.append("status", params.status);
        const url = `book${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Book"],
      transformResponse: (
        response: ApiResponse<{
          items: Book[];
          pagination: { total: number; page: number; limit: number; totalPages: number };
        }>
      ) => ({
        data: response.data.items,
        totalPages: response.data.pagination.totalPages,
        totalItems: response.data.pagination.total,
      }),
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
    incrementBookDownloadCount: builder.mutation<Book, string>({
      query: (id) => ({
        url: `book/${id}/increment-download`,
        method: "PATCH",
      }),
      invalidatesTags: ["Book"],
      transformResponse: (response: ApiResponse<Book>) => response.data,
    }),
    incrementBookViewCount: builder.mutation<Book, string>({
      query: (id) => ({
        url: `book/${id}/increment-views`,
        method: "PATCH",
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
  useIncrementBookDownloadCountMutation,
  useIncrementBookViewCountMutation,
} = bookApi;
