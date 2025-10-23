import { createApi, enhancedBaseQuery } from "./base-api";
import {} from "@/types/module-de-formation";

// Lesson Document API
export const moduleDeFormationApi = createApi({
  reducerPath: "moduleDeFormationApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["ModuleDeFormation"],
  endpoints: (builder) => ({}),
});

export const {} = moduleDeFormationApi;
