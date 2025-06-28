import { createApi, enhancedBaseQuery } from "../base-api";

interface IAddSeance {
  id_session: string;
  seance_date_on: string;
  type_seance: string;
  duree: string;
  id_cours: string;
}

interface IUpdateSeance {
  id_session: string | number; // Assuming this is a unique identifier, could be string or number
  seance_date_on: Date | string; // Could be Date object or ISO date string
  type_seance: string; // Type of the session
  duree: number; // Duration (assuming in minutes or seconds)
  id_cours: string | number; // Course ID, could be string or number
}

interface IListSeance {
  status: number;
  message: string;
  data: {
    length: number;
    list: Array<{
      seance_date_on: number; // Unix timestamp
      id: number;
      id_session: number;
      duree: number;
      type_seance: string; // or use union type: "onLine" | "inPerson" | "hybrid"
      id_formation: number;
      id_cours: number;
      piece_jointe: null | string; // or File type if handling uploads
      createdAt: string; // ISO date format
      updatedAt: string; // ISO date format
    }>;
  };
}

// Training Secretary API
export const seanceSecretaryApi = createApi({
  reducerPath: "seanceSecretaryApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["SeanceSecretary"],
  endpoints: (builder) => ({
    listSeance: builder.query<IListSeance, { idSession: string; idCours: string }>({
      query: ({ idSession, idCours }) => `sessions/${idSession}/${idCours}/seances`,
      providesTags: ["SeanceSecretary"],
    }),
    addSeance: builder.mutation<void, IAddSeance>({
      query: (request) => ({
        url: "/api/sessions/session/addseance",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["SeanceSecretary"],
    }),
    updateSeance: builder.mutation<void, IUpdateSeance>({
      query: (request) => ({
        url: `/api/sessions/session/addseance/${request.id_session}`,
        method: "PUT",
        body: request,
      }),
      invalidatesTags: ["SeanceSecretary"],
    }),
    removeSeance: builder.mutation<void, { idseance: string | number }>({
      query: (request) => ({
        url: `/api/sessions/session/addseance/${request.idseance}`,
        method: "DELETE",
        body: request,
      }),
      invalidatesTags: ["SeanceSecretary"],
    }),
  }),
});

export const { useAddSeanceMutation } = seanceSecretaryApi;
