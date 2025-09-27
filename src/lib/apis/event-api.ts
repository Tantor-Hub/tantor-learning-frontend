import { createApi, enhancedBaseQuery } from "./base-api";
import {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventListResponse,
  EventResponse,
} from "@/types/event";

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    // Get events by session ID
    getEventsBySession: builder.query<EventListResponse, { sessionId: string }>({
      query: ({ sessionId }) => `event/session/${sessionId}`,
      providesTags: (result, error, { sessionId }) => [{ type: "Event", id: sessionId }, "Event"],
    }),

    // Create new event
    createEvent: builder.mutation<EventResponse, CreateEventRequest>({
      query: (data) => ({
        url: "event/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),

    // Update event
    updateEvent: builder.mutation<EventResponse, UpdateEventRequest>({
      query: ({ id, ...data }) => ({
        url: `event/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Event", id }, "Event"],
    }),

    // Delete event
    deleteEvent: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Event", id }, "Event"],
    }),
  }),
});

export const {
  useGetEventsBySessionQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
