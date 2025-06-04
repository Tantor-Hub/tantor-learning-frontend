import { baseQuery, createApi } from "./base-api";
import { ISubscribeNewsLetterRequest, ISubscribeNewsLetterResponse } from "@/types/public-api";

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
  }),
});

export const { useSubscribeNewsLetterMutation } = publicApi;
