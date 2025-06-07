import { IListPlanning } from "@/types/common/planning-api";
import { baseQuery, createApi } from "../base-api";

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
  reducerPath: "eventApi",
  baseQuery,
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    listEvents: builder.query<IListPlanning, void>({
      query: () => "/api/cms/events/e/list",
      providesTags: ["Event"],
    }),
    addEvent: builder.mutation<AddEventResponse, AddEventRequest>({
      query: (userData) => ({
        url: "/api/cms/events/event/add",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation<void, DeleteEventRequest>({
      query: ({ id }) => ({
        url: `/api/cms/events/event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const { useListEventsQuery, useAddEventMutation, useDeleteEventMutation } = EventApi;
