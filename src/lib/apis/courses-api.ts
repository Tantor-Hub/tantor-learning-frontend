import { baseQuery, createApi } from "./base-api";

export interface ContactForm {
  from_name: string;
  from_mail: string;
  subject: string;
  content: string;
}

export interface ResponseContactForm {
  status: number;
  message: string;
}

// Contact Form API

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery,
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    contactFormAPI: builder.mutation<ResponseContactForm, ContactForm>({
      query: (data) => ({
        url: "/api/cms/contactus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useContactFormAPIMutation } = coursesApi;
