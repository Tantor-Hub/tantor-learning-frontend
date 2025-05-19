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

export const contactFormAPI = createApi({
  reducerPath: "contactFormAPI",
  baseQuery,
  tagTypes: ["ContactForm"],
  endpoints: (builder) => ({
    contactFormAPI: builder.mutation<ResponseContactForm, ContactForm>({
      query: (data) => ({
        url: "/api/cms/contactus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ContactForm"],
    }),
  }),
});

export const { useContactFormAPIMutation } = contactFormAPI;
