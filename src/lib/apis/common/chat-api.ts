import { baseQuery, createApi } from "../base-api";
import {
  ICreateMessageRequest,
  ICreateMessageResponse,
  IGetAllMessagesResponse,
  IGetMessageByIdResponse,
  IListChatTreadResponse,
} from "@/types/common/message-api";

// Chat API
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery,
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    // TREAD
    // Liste des messages par thread
    listChatTread: builder.query<IListChatTreadResponse, { id: string }>({
      query: ({ id }) => `cms/messages/thread/${id}`,
      providesTags: ["Chat"],
    }),

    listChat: builder.query<IGetAllMessagesResponse, void>({
      query: () => "cms/messages/list",
      providesTags: ["Chat"],
    }),
    // create Message By Thread -> a reply message -> pour tread ajouter messageID & tread

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
        url: `cms/messages/message/delete/${id}`,
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
    getMessageById: builder.query<IGetMessageByIdResponse, { id: string }>({
      query: ({ id }) => ({
        url: `cms/messages/message/${id}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    // authenticated user messages
    listMessageByUserId: builder.query({
      query: () => ({
        url: "chat/user",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const {
  useDeleteChatMutation,
  useArchivedChatMutation,
  useListChatByCategoryQuery,
  useListChatQuery,
  useCreateMessageMutation,
  useGetMessageByIdQuery,
  useListChatTreadQuery,
  useListMessageByUserIdQuery,
} = chatApi;
