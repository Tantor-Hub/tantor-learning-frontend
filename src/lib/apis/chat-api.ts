import { baseQuery, createApi } from "./base-api";

interface CreateMessageRequest {
  subject: string;
  content: string;
  piece_jointe?: File;
}

interface MessageRequest {
  id?: string;
  group?: string;
}

export interface Message {
  // Define your message interface properties here
  id: string;
  subject: string;
  content: string;
  // Add other message properties as needed
}

// Chat API
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery,
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    listChat: builder.query<Message[], void>({
      query: () => "/api/cms/messages/list",
      providesTags: ["Chat"],
    }),
    createChat: builder.mutation<void, CreateMessageRequest>({
      query: (userData) => ({
        url: "/api/cms/messages/message/send",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/cms/messages/message/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    archivedChat: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/cms/messages/message/archive/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    listChatByCategory: builder.query<Message[], { group: string }>({
      query: ({ group }) => ({
        url: `/api/cms/messages/list/${group}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    chatById: builder.query<Message, { id: string }>({
      query: ({ id }) => ({
        url: `/api/cms/messages/message/${id}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const {
  useDeleteChatMutation,
  useCreateChatMutation,
  useArchivedChatMutation,
  useListChatByCategoryQuery,
  useListChatQuery,
} = chatApi;
