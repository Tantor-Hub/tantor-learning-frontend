import { baseQuery, createApi, enhancedBaseQuery } from "./base-api";

export interface StudentStatusResponse {
  status: number;
  message: string;
  data: [
    {
      enrolledCourses: number;
      ongoingCourses: number;
    },
    {
      homework: number;
      nextDelivery: {
        length: number;
        date: string | null;
      };
    },
    {
      unreadMessageNumber: number;
    },
  ];
}

export interface NextLiveSessionResponse {
  status: number;
  message: string;
  data: []; // or: data: [] if you want it strictly typed as an empty array
}

interface AverageScoreResponse {
  status: number;
  message: string;
  data: {
    scoreOngoingSemester: number;
    totalOngoingSemester: number;
    scoreLastSemester: number;
    totalLastSemeter: number;
  };
}

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery,
  tagTypes: ["Student"],
  endpoints: (builder) => ({
    studentStatus: builder.query<StudentStatusResponse, void>({
      query: () => "cms/dashboard/cards",
      providesTags: ["Student"],
    }),
    nextLiveSession: builder.query<NextLiveSessionResponse, void>({
      query: () => "cms/dashboard/nextlivessessions",
      providesTags: ["Student"],
    }),
    averageScore: builder.query<AverageScoreResponse, void>({
      query: () => "cms/dashboard/averages",
      providesTags: ["Student"],
    }),
  }),
});

export const { useAverageScoreQuery, useNextLiveSessionQuery, useStudentStatusQuery } = studentApi;
