// File: src/lib/api/base-api.ts
import { RootState } from "@/store/store";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

// Base query with authentication
export const baseQuery = fetchBaseQuery({
  baseUrl: "https://tantor.buhendje.com",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");

    // Get token from state with proper type handling
    const state = getState() as RootState;
    const token = state.auth?.token;

    if (token) {
      headers.set("x-connexion-tantor", `Bearer ${token}`);
    }
    return headers;
  },
});

// Define common tag types for cache invalidation
export const commonTagTypes = ["Auth", "User", "Formation", "Category"];

// Re-export for convenience
export { createApi };
