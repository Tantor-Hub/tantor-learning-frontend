// File: src/lib/apis/api.ts
import { authApi } from "./auth-api";
import { usersApi } from "./users-api";
import { formationsApi } from "./formations-api";
import { categoriesApi } from "./categories-api";
import { thematicsApi } from "./thematics-api";
import { contactFormAPI } from "./contact-form";
import { AdminApi } from "./admin-api";

// Export all API slices for easy access
export { authApi, usersApi, formationsApi, categoriesApi, thematicsApi };

// Combine all reducers for easy store setup
export const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [formationsApi.reducerPath]: formationsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [thematicsApi.reducerPath]: thematicsApi.reducer,
  [contactFormAPI.reducerPath]: contactFormAPI.reducer,
  [AdminApi.reducerPath]: AdminApi.reducer,
};

// Combine all middlewares for easy store setup
export const apiMiddlewares = [
  authApi.middleware,
  usersApi.middleware,
  formationsApi.middleware,
  categoriesApi.middleware,
  thematicsApi.middleware,
  contactFormAPI.middleware,
  AdminApi.middleware,
];
