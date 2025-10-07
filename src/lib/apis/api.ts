import { authApi } from "./auth-api";
import { usersApi } from "./users-api";
import { formationsApi } from "./formations-api";
import { categoriesApi } from "./categories-api";
import { thematicsApi } from "./thematics-api";
import { AdminApi } from "./admin/user-api";
import { EventApi } from "./common/planning";
import { coursesApi } from "./courses-api";
import { chatApi } from "./common/chat-api";
import { studentApi } from "./student-api";
import { publicApi } from "./public/public-api";
import { trainingSecretaryApi } from "./secretary/training-secretary-api";
import { sessionSecretaryApi } from "./secretary/session-secretary-api";
import { trainingStudentApi } from "./student/training-api";
import { manageCoursesApi } from "./common/courses-api";
import { seanceSecretaryApi } from "./secretary/seance-secretary-api";
import { documentStudentApi } from "./student/document-api";
import { instructorApi } from "./instructor/instructor";
import { studentEvaluationApi } from "./instructor/student-evaluation";
import { evaluationQuestionApi } from "./instructor/evaluation-question";
import { roleApi } from "./admin/role-api";
import { documentsApi } from "./common/document-api";
import { eventApi } from "./event-api";
import { evaluationQuestionOptionApi } from "./instructor/evaluation-question-option";
// Export all API slices for easy access
export {
  authApi,
  usersApi,
  documentsApi,
  formationsApi,
  categoriesApi,
  thematicsApi,
  AdminApi,
  EventApi,
  chatApi,
  coursesApi,
  studentApi,
  publicApi,
  trainingSecretaryApi,
  trainingStudentApi,
  sessionSecretaryApi,
  manageCoursesApi,
  seanceSecretaryApi,
  documentStudentApi,
  instructorApi,
  studentEvaluationApi,
  evaluationQuestionApi,
  evaluationQuestionOptionApi,
  roleApi,
  eventApi,
};

// Combine all reducers for easy store setup
export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [formationsApi.reducerPath]: formationsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [thematicsApi.reducerPath]: thematicsApi.reducer,
  [AdminApi.reducerPath]: AdminApi.reducer,
  [EventApi.reducerPath]: EventApi.reducer,
  [coursesApi.reducerPath]: coursesApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [studentApi.reducerPath]: studentApi.reducer,
  [publicApi.reducerPath]: publicApi.reducer,
  [trainingSecretaryApi.reducerPath]: trainingSecretaryApi.reducer,
  [sessionSecretaryApi.reducerPath]: sessionSecretaryApi.reducer,
  [trainingStudentApi.reducerPath]: trainingStudentApi.reducer,
  [manageCoursesApi.reducerPath]: manageCoursesApi.reducer,
  [seanceSecretaryApi.reducerPath]: seanceSecretaryApi.reducer,
  [documentStudentApi.reducerPath]: documentStudentApi.reducer,
  [instructorApi.reducerPath]: instructorApi.reducer,
  [studentEvaluationApi.reducerPath]: studentEvaluationApi.reducer,
  [evaluationQuestionApi.reducerPath]: evaluationQuestionApi.reducer,
  [evaluationQuestionOptionApi.reducerPath]: evaluationQuestionOptionApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [documentsApi.reducerPath]: documentsApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
};

// Combine all middlewares for easy store setup
export const apiMiddlewares = [
  authApi.middleware,
  usersApi.middleware,
  formationsApi.middleware,
  categoriesApi.middleware,
  thematicsApi.middleware,
  AdminApi.middleware,
  EventApi.middleware,
  chatApi.middleware,
  coursesApi.middleware,
  studentApi.middleware,
  publicApi.middleware,
  trainingStudentApi.middleware,
  trainingSecretaryApi.middleware,
  sessionSecretaryApi.middleware,
  manageCoursesApi.middleware,
  seanceSecretaryApi.middleware,
  documentStudentApi.middleware,
  instructorApi.middleware,
  studentEvaluationApi.middleware,
  evaluationQuestionApi.middleware,
  evaluationQuestionOptionApi.middleware,
  roleApi.middleware,
  documentsApi.middleware,
  eventApi.middleware,
];
