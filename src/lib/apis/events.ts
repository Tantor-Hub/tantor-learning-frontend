import { createApi, enhancedBaseQuery } from "./base-api";
import {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventListResponse,
  EventResponse,
  CreateEventForLessonsRequest,
  StudentsAttendanceResponse,
} from "@/types/events";
import { ICourseBySessionIdResponse } from "@/types/secretary/training-secretary";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["Event", "Course"],
  endpoints: (builder) => ({
    // Get events by session ID
    getEventsBySession: builder.query<EventListResponse, { sessionId: string }>({
      query: ({ sessionId }) => `event/session/${sessionId}`,
      providesTags: (result, error, { sessionId }) => [{ type: "Event", id: sessionId }, "Event"],
    }),

    // Create new event
    createEvent: builder.mutation<EventResponse, CreateEventRequest & { courseId: string }>({
      query: ({ courseId, ...data }) => ({
        url: `event/create-for-course/${courseId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),

    // Update event
    updateEvent: builder.mutation<EventResponse, UpdateEventRequest>({
      query: ({ id, courseId, ...data }) => ({
        url: `event/update/${id}`,
        method: "PATCH",
        body: courseId ? { ...data, id_cible_cours: courseId } : data,
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

    // Get courses by session ID
    getCoursesBySession: builder.query<ICourseBySessionIdResponse, { sessionId: string }>({
      query: ({ sessionId }) => `sessioncours/session/${sessionId}`,
      providesTags: (result, error, { sessionId }) => [{ type: "Course", id: sessionId }, "Course"],
    }),

    // create event for lessons

    createEventForLessons: builder.mutation<EventResponse, CreateEventForLessonsRequest>({
      query: (request) => ({
        url: "event/create-for-lesson",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Event"],
    }),
    // student Access
    joinEvent: builder.mutation<void, { eventId: string }>({
      query: ({ eventId }) => ({
        url: `event/student/${eventId}/join`,
        method: "POST",
      }),
      invalidatesTags: ["Event"],
    }),

    // Get students attendance for instructor sessioncours
    getStudentsAttendance: builder.query<StudentsAttendanceResponse, void>({
      query: () => `event/instructor/students-attendance`,
      providesTags: ["Event"],
    }),

    // Get past events for instructor
    getPastEventsForInstructor: builder.query<
      {
        status: number;
        data: {
          length: number;
          rows: Event[];
        };
        message: string;
      },
      void
    >({
      query: () => `event/instructor/past-events`,
      providesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsBySessionQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetCoursesBySessionQuery,
  useCreateEventForLessonsMutation,
  // secretary Access
  useGetStudentsAttendanceQuery,
  // student Access
  useJoinEventMutation,
  useGetPastEventsForInstructorQuery,
} = eventsApi;
