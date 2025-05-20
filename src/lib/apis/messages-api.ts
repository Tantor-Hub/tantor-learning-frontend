import { baseQuery, createApi } from "./base-api";

export interface CreateMessageRequest {
  subject: string;
  content: string;
  piece_jointe?: File;
}

export interface MessageRequest {
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

export const MessageApi = createApi({
  reducerPath: "messageApi",
  baseQuery,
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    listMessage: builder.query<Message[], void>({
      query: () => "/api/cms/messages/list",
      providesTags: ["Message"],
    }),
    createMessage: builder.mutation<void, CreateMessageRequest>({
      query: (userData) => ({
        url: "/api/cms/messages/message/send",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Message"],
    }),
    deleteMessage: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/cms/messages/message/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
    archivedMessage: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/cms/messages/message/archive/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
    listMessageByCategory: builder.query<Message[], { group: string }>({
      query: ({ group }) => ({
        url: `/api/cms/messages/list/${group}`,
        method: "GET",
      }),
      providesTags: ["Message"],
    }),
    messageById: builder.query<Message, { id: string }>({
      query: ({ id }) => ({
        url: `/api/cms/messages/message/${id}`,
        method: "GET",
      }),
      providesTags: ["Message"],
    }),
  }),
});

export const {
  useListMessageQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useArchivedMessageMutation,
  useListMessageByCategoryQuery,
  useMessageByIdQuery,
} = MessageApi;
