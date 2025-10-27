import { createApi, enhancedBaseQuery } from "./base-api";
import {
  IStudentAnswerOption,
  IStudentAnswerOptionsResponse,
  IStudentAnswerOptionResponse,
} from "@/types/student-answer-options";

export interface IStudentAnswerOptionsByQuestionResponse {
  status: number;
  message: string;
  data: {
    answerOptions: IStudentAnswerOption[];
    total: number;
    questionId: string;
  };
}

export const studentAnswerOptionsApi = createApi({
  reducerPath: "studentAnswerOptionsApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["StudentAnswerOption"],
  endpoints: (builder) => ({
    getAllStudentAnswerOptions: builder.query<IStudentAnswerOptionsResponse, void>({
      query: () => "studentansweroption",
      providesTags: ["StudentAnswerOption"],
    }),
    createStudentAnswerOption: builder.mutation<
      IStudentAnswerOptionResponse,
      { questionId: string; optionId: string }
    >({
      query: (body) => ({
        url: "studentansweroption",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StudentAnswerOption"],
    }),
    getStudentAnswerOptionById: builder.query<IStudentAnswerOptionResponse, string>({
      query: (id) => `studentansweroption/${id}`,
      providesTags: ["StudentAnswerOption"],
    }),
    updateStudentAnswerOption: builder.mutation<
      IStudentAnswerOptionResponse,
      { id: string; optionId: string }
    >({
      query: ({ id, ...body }) => ({
        url: `studentansweroption/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["StudentAnswerOption"],
    }),
    deleteStudentAnswerOption: builder.mutation<{ status: number; message: string }, string>({
      query: (id) => ({
        url: `studentansweroption/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StudentAnswerOption"],
    }),
    getStudentAnswerOptionsByStudentAnswerId: builder.query<IStudentAnswerOptionsResponse, string>({
      query: (studentAnswerId) => `studentansweroption/student-answer/${studentAnswerId}`,
      providesTags: ["StudentAnswerOption"],
    }),

    // student access

    getStudentAnswerOptionsByQuestionId: builder.query<
      IStudentAnswerOptionsByQuestionResponse,
      string
    >({
      query: (questionId) => `studentansweroption/question/${questionId}`,
      providesTags: ["StudentAnswerOption"],
    }),
  }),
});

export const {
  useGetAllStudentAnswerOptionsQuery,
  useCreateStudentAnswerOptionMutation,
  useGetStudentAnswerOptionByIdQuery,
  useUpdateStudentAnswerOptionMutation,
  useDeleteStudentAnswerOptionMutation,
  useGetStudentAnswerOptionsByStudentAnswerIdQuery,
  // student access
  useLazyGetStudentAnswerOptionsByQuestionIdQuery,
  useGetStudentAnswerOptionsByQuestionIdQuery,
} = studentAnswerOptionsApi;
