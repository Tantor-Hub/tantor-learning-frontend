import { createApi, enhancedBaseQuery } from "./base-api";

// Define the response type for getSecretaryCardPayments
export interface SecretaryCardPayment {
  userId: string;
  userEmail: string;
  sessionId: string;
  sessionTitle: string;
  status: string;
  paymentStatus: string;
  stripePaymentId: string;
}

export interface SecretaryCardPaymentsResponse {
  status: number;
  message: string;
  data: SecretaryCardPayment[];
}

export const paymentMethodCardApi = createApi({
  reducerPath: "paymentMethodCardApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["PaymentIntent", "SecretaryCardPayments"],
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

    // Get all Card payments for secretary management
    getSecretaryCardPayments: builder.query<SecretaryCardPaymentsResponse, void>({
      query: () => ({
        url: "paymentmethodcard/secretary/payments",
        method: "GET",
      }),
      providesTags: ["SecretaryCardPayments"],
    }),
  }),
});

export const { useCreatePaymentIntentMutation, useGetSecretaryCardPaymentsQuery } =
  paymentMethodCardApi;
