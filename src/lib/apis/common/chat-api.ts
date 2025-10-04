import { baseQuery, createApi } from "../base-api";
import {
  ICreateMessageRequest,
  ICreateMessageResponse,
  IGetAllMessagesResponse,
  IGetMessageByIdResponse,
  IListChatTreadResponse,
  IUpdateMessageRequest,
} from "@/types/common/message-api";

// Chat API
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery,
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    createMessage: builder.mutation<ICreateMessageResponse, ICreateMessageRequest>({
      query: (request) => ({
        url: "chat/create",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `chat`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    archivedChat: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `cms/messages/message/archive/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    listChatByCategory: builder.query<IGetAllMessagesResponse, { group: string }>({
      query: ({ group }) => ({
        url: `cms/messages/list/${group}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    getChatById: builder.query<IGetMessageByIdResponse, { id: string }>({
      query: ({ id }) => ({
        url: `chat/${id}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    getRepliesByChatId: builder.query<IListChatTreadResponse, { chatId: string }>({
      query: ({ chatId }) => ({
        url: `replieschat/chat/${chatId}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    createReply: builder.mutation<any, { content: string; id_chat: string; is_public: boolean }>({
      query: (request) => ({
        url: "replieschat/create",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Chat"],
    }),

    // authenticated user messages
    listMessageByUserId: builder.query({
      query: () => ({
        url: "chat/user",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    updateChat: builder.mutation<void, IUpdateMessageRequest>({
      query: (request) => ({
        url: "chat",
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["Chat"],
    }),

    markAsRead: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `chat/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useDeleteChatMutation,
  useArchivedChatMutation,
  useListChatByCategoryQuery,
  useCreateMessageMutation,
  useListMessageByUserIdQuery,
  useUpdateChatMutation,
  useMarkAsReadMutation,
  useGetChatByIdQuery,
  useGetRepliesByChatIdQuery,
  useCreateReplyMutation,
} = chatApi;
