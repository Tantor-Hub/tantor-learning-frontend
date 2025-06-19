import { createApi, enhancedBaseQuery } from "../base-api";

interface IAddSeance {
  id_session: string;
  seance_date_on: string;
  type_seance: string;
  duree: string;
  id_cours: string;
}
// Training Secretary API
export const seanceSecretaryApi = createApi({
  reducerPath: "seanceSecretaryApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["SeanceSecretary"],
  endpoints: (builder) => ({
    addSeance: builder.mutation<void, IAddSeance>({
      query: (body) => ({
        url: "/api/sessions/session/addseance",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["SeanceSecretary"],
    }),
  }),
});

export const { useAddSeanceMutation } = seanceSecretaryApi;
