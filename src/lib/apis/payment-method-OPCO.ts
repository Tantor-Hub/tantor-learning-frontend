import { createApi, enhancedBaseQuery } from "./base-api";
import {
  OPCOSPaymentResponse,
  UpdateOPCOSStatusRequest,
  UpdateOPCOSStatusResponse,
  CreateOPCOSPaymentRequest,
  CreateOPCOSPaymentResponse,
  OPCOSPaymentStatus,
} from "@/types/payment-method-OPCO";

export const paymentMethodOPCOApi = createApi({
  reducerPath: "paymentMethodOPCOApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["PaymentMethod"],
  endpoints: (builder) => ({
    // Get all OPCO payments for secretary management
    getSecretaryOPCOPayments: builder.query<OPCOSPaymentResponse, void>({
      query: () => ({
        url: "paymentmethodopco/secretary/payments",
        method: "GET",
      }),
      providesTags: ["PaymentMethod"],
    }),

    // Update OPCO payment status for secretary management
    updateOPCOStatus: builder.mutation<UpdateOPCOSStatusResponse, UpdateOPCOSStatusRequest>({
      query: (body) => ({
        url: "paymentmethodopco/secretary/update-status",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PaymentMethod"],
    }),

    // Create a new payment method OPCO
    createOPCOPayment: builder.mutation<CreateOPCOSPaymentResponse, CreateOPCOSPaymentRequest>({
      query: (body) => ({
        url: "paymentmethodopco/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentMethod"],
    }),
  }),
});

export const {
  useGetSecretaryOPCOPaymentsQuery,
  useUpdateOPCOStatusMutation,
  useCreateOPCOPaymentMutation,
} = paymentMethodOPCOApi;
