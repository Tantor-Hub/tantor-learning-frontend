import { baseQuery, createApi } from "../base-api";
import {
  IContactFormRequest,
  IContactFormResponse,
  IGetAllTrainingsResponse,
  ILibraryResponse,
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
  }),
});

export const {
  useSubscribeNewsLetterMutation,
  useGetAllTrainingsQuery,
  useGetAllBooksInLibraryQuery,
  useContactFormAPIMutation,
} = publicApi;
