import { baseQuery, createApi } from "../base-api";
import {
  IContactFormRequest,
  IContactFormResponse,
  IGetAllTrainingsResponse,
  ILibraryResponse,
  IListFormationResponse,
  IListSessionsByFormationIdResponse,
  ISubscribeNewsLetterRequest,
  ISubscribeNewsLetterResponse,
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
        url: "/api/cms/newsletter",
        method: "POST",
        body: body,
      }),
    }),
    getAllTrainings: builder.query<IGetAllTrainingsResponse, void>({
      query: () => "/api/sessions/list",
      providesTags: ["Public"],
    }),
    contactFormAPI: builder.mutation<IContactFormResponse, IContactFormRequest>({
      query: (data) => ({
        url: "/api/cms/contactus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Public"],
    }),
    getAllBooksInLibrary: builder.query<ILibraryResponse, void>({
      query: () => "/api/cms/librairies/list",
      providesTags: ["Public"],
    }),
    // Liste de Formations
    listFormations: builder.query<IListFormationResponse, void>({
      query: () => "/api/formations/list",
      providesTags: ["Public"],
    }),
    // get Formations by Id -> sessions
    ListSessionsByFormationId: builder.query<IListSessionsByFormationIdResponse, { id: string }>({
      query: ({ id }) => `/api/sessions/byidformation/${id}`,
      providesTags: ["Public"],
    }),
  }),
});

export const {
  useSubscribeNewsLetterMutation,
  useGetAllTrainingsQuery,
  useGetAllBooksInLibraryQuery,
  useContactFormAPIMutation,
  useListFormationsQuery,
  useListSessionsByFormationIdQuery,
} = publicApi;
