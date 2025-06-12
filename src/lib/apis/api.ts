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
// Export all API slices for easy access
export {
  authApi,
  usersApi,
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
  sessionSecretaryApi,
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
  trainingSecretaryApi.middleware,
  sessionSecretaryApi.middleware,
];
