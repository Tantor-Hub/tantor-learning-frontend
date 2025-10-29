import { baseQuery, createApi } from "./base-api";

interface UploadImageResponse {
  url: string;
}

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery,
  tagTypes: ["Upload"],
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "uploads/image",
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let the browser set it with boundary
        prepareHeaders: (headers: any) => {
          headers.delete("Content-Type");
          return headers;
        },
      }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
