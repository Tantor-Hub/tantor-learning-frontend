import { baseQuery, createApi } from "../base-api";
import {
  ICreateMessageRequest,
  ICreateMessageResponse,
  IGetAllMessagesResponse,
  IGetMessageByIdResponse,
} from "@/types/common/message-api";

// Chat API
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery,
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    listChat: builder.query<IGetAllMessagesResponse, void>({
      query: () => "/api/cms/messages/list",
      providesTags: ["Chat"],
    }),
    createMessage: builder.mutation<ICreateMessageResponse, ICreateMessageRequest>({
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

    listChatByCategory: builder.query<IGetAllMessagesResponse, { group: string }>({
      query: ({ group }) => ({
        url: `/api/cms/messages/list/${group}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    getMessageById: builder.query<IGetMessageByIdResponse, { id: string }>({
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
  useArchivedChatMutation,
  useListChatByCategoryQuery,
  useListChatQuery,
  useCreateMessageMutation,
  useGetMessageByIdQuery,
} = chatApi;
