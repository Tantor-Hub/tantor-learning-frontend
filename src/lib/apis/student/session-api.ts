// import { baseQuery, createApi } from "../base-api";
// import {
//   IGetAllTrainingsResponse,
//   ISessionDetailsResponse,
//   IApplyToTrainingRequest,
// } from "@/types/student/traning-api";

// export const sessionStudentApi = createApi({
//   reducerPath: "sessionStudentApi",
//   baseQuery,
//   tagTypes: ["SessionStudent"],
//   endpoints: (builder) => ({
//     sessionList: builder.query<void, IGetAllTrainingsResponse>({
//       query: () => "/api/sessions/list",
//       providesTags: ["SessionStudent"],
//     }),
//     getTrainingsByCategory: builder.query<IGetAllTrainingsResponse, number>({
//       query: (id_category) => `/api/sessions/list/bycategory/${id_category}`,
//       providesTags: ["SessionStudent"],
//     }),
//     getTrainingsByThematicAndCategory: builder.query<
//       IGetAllTrainingsResponse,
//       { idThematic: number; idCategory: number }
//     >({
//       query: ({ idThematic, idCategory }) => `/api/sessions/list/by/${idThematic}/${idCategory}`,
//       providesTags: ["SessionStudent"],
//     }),
//     getTrainingsByKeyword: builder.query<IGetAllTrainingsResponse, string>({
//       query: (keyword) => `/api/sessions/list/bykeyword/?keyword=${keyword}`,
//       providesTags: ["SessionStudent"],
//     }),
//     getTrainingsByGroup: builder.query<IGetAllTrainingsResponse, string>({
//       query: (group) => `/api/sessions/list/bygroups/${group}`,
//       providesTags: ["SessionStudent"],
//     }),

//     applyToTraining: builder.mutation<void, IApplyToTrainingRequest>({
//       query: (body) => ({
//         url: `/api/sessions/session/apply`,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["SessionStudent"],
//     }),

//     getMySessions: builder.query<IGetAllTrainingsResponse, void>({
//       query: () => `/api/sessions/mylist`,
//       providesTags: ["SessionStudent"],
//     }),

//     getTrainingById: builder.query<ISessionDetailsResponse, number>({
//       query: (id_session) => `/api/sessions/session/${id_session}`,
//       providesTags: ["SessionStudent"],
//     }),
//   }),
// });

// export const { useGetAllTrainingsQuery, useGetTrainingsByCategoryQuery } = sessionStudentApi;
