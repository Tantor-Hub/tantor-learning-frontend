import { IListPlanning } from "@/types/common/planning-api";
import { baseQuery, createApi, enhancedBaseQuery } from "../base-api";

export interface InstructorEventsResponse {
  status: number;
  data: {
    length: number;
    rows: {
      id: string;
      title: string;
      description?: string;
      begining_date: string;
      beginning_hour: string;
      ending_hour: string;
      id_cible_cours: string;
      id_cible_session: string;
      createdBy: string;
      createdAt: string;
      updatedAt: string;
      sessionCours: {
        id: string;
        title: string;
        id_session: string;
        id_formateur: string[];
      };
      trainingSession: {
        id: string;
        title: string;
      };
      creator: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }[];
  };
  message: string;
}

export interface AddEventRequest {
  titre: string;
  description: string;
  type: string;
  id_cibling?: number | null;
  timeline: string | [string, string]; // Single ISO date string or tuple of two ISO date strings
}

export interface AddEventResponse {
  status: number;
  message: string;
}

export interface DeleteEventRequest {
  id: string;
}
export const EventApi = createApi({
  reducerPath: "planningEventApi",
  baseQuery,
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    listEvents: builder.query<IListPlanning, void>({
      query: () => "event/user",
      providesTags: ["Event"],
    }),
    listInstructorEvents: builder.query<InstructorEventsResponse, void>({
      query: () => "event/instructor/mycourses",
      providesTags: ["Event"],
    }),

    listStudentEventsBySession: builder.query<IListPlanning, string>({
      query: (sessionId) => `event/student/session/${sessionId}`,
      providesTags: ["Event"],
    }),
    addEvent: builder.mutation<AddEventResponse, AddEventRequest>({
      query: (body) => ({
        url: "cms/events/event/add",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation<void, DeleteEventRequest>({
      query: ({ id }) => ({
        url: `cms/events/event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useListEventsQuery,
  useListInstructorEventsQuery,
  useListStudentEventsBySessionQuery,
  useAddEventMutation,
  useDeleteEventMutation,
} = EventApi;
