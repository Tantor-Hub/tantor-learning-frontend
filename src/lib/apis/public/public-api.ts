import { baseQuery, createApi } from "../base-api";
import {
  IContactFormRequest,
  IContactFormResponse,
  IGetAllTrainingsResponse,
  IGetSessionByIdResponse,
  ILibraryResponse,
  IListFormationResponse,
  IListSessionsByFormationIdResponse,
  ISubscribeNewsLetterRequest,
  ISubscribeNewsLetterResponse,
  IUnsubscribeNewsLetterRequest,
  IUnsubscribeNewsLetterResponse,
} from "@/types/public-api";

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery,
  tagTypes: ["Public"],
  endpoints: (builder) => ({
    subscribeNewsLetter: builder.mutation<
      ISubscribeNewsLetterResponse,
      ISubscribeNewsLetterRequest
    >({
      query: (body) => ({
        url: "cms/newsletter",
        method: "POST",
        body: body,
      }),
    }),
    unsubscribeNewsLetter: builder.mutation<
      IUnsubscribeNewsLetterResponse,
      IUnsubscribeNewsLetterRequest
    >({
      query: (request) => ({
        url: "cms/newsletter/unsubscribe",
        method: "POST",
        body: request,
      }),
    }),
    getAllTrainings: builder.query<IGetAllTrainingsResponse, void>({
      query: () => "sessions/list",
      providesTags: ["Public"],
    }),
    contactFormAPI: builder.mutation<IContactFormResponse, IContactFormRequest>({
      query: (data) => ({
        url: "cms/contactus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Public"],
    }),
    getAllBooksInLibrary: builder.query<ILibraryResponse, void>({
      query: () => "cms/librairies/list",
      providesTags: ["Public"],
    }),
    // Liste de Formations
    listFormations: builder.query<IListFormationResponse, void>({
      query: () => "formations/list",
      providesTags: ["Public"],
    }),
    // get Formations by Id -> sessions
    ListSessionsByFormationId: builder.query<IListSessionsByFormationIdResponse, { id: string }>({
      query: ({ id }) => `sessions/byidformation/${id}`,
      providesTags: ["Public"],
    }),
    // get Formations by Id -> sessions
    getSessionById: builder.query<IGetSessionByIdResponse, { id_session: string }>({
      query: (request) => `sessions/session/${request.id_session}`,
      providesTags: ["Public"],
    }),
  }),
});

export const {
  useSubscribeNewsLetterMutation,
  useUnsubscribeNewsLetterMutation,
  useGetAllTrainingsQuery,
  useGetAllBooksInLibraryQuery,
  useContactFormAPIMutation,
  useListFormationsQuery,
  useListSessionsByFormationIdQuery,
  useGetSessionByIdQuery,
} = publicApi;
