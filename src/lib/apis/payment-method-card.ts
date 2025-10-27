import { createApi, enhancedBaseQuery } from "./base-api";

export const paymentMethodCardApi = createApi({
  reducerPath: "paymentMethodCardApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["PaymentIntent"],
  endpoints: (builder) => ({
    // Create Payment Intent for Card Payment
    createPaymentIntent: builder.mutation<
      {
        data: {
          clientSecret: string;
          paymentIntentId: string;
        };
      },
      {
        id_session: string;
        stripe_payment_intent_id: string; // Optional - Stripe Payment Intent ID
      }
    >({
      query: (payload) => ({
        url: "paymentmethodcard/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PaymentIntent"],
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentMethodCardApi;
