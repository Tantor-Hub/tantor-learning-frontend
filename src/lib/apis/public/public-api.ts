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
        url: "cms/newsletter",
        method: "POST",
        body: body,
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
