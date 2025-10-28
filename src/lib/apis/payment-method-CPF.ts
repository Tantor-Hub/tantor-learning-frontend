import { createApi, enhancedBaseQuery } from "./base-api";
import {
  CPFPaymentResponse,
  UpdateCPFStatusRequest,
  UpdateCPFStatusResponse,
  CreateCPFPaymentRequest,
  CreateCPFPaymentResponse,
  CPFPaymentStatus,
} from "@/types/payment-method-CPF";

export const paymentMethodCPFApi = createApi({
  reducerPath: "paymentMethodCPFApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["PaymentMethod"],
  endpoints: (builder) => ({
    // Get all CPF payments for secretary management
    getSecretaryCPFPayments: builder.query<CPFPaymentResponse, void>({
      query: () => ({
        url: "paymentmethodcpf/secretary/payments",
        method: "GET",
      }),
      providesTags: ["PaymentMethod"],
    }),

    // Update CPF payment status for secretary management
    updateCPFStatus: builder.mutation<UpdateCPFStatusResponse, UpdateCPFStatusRequest>({
      query: (body) => ({
        url: "paymentmethodcpf/secretary/update-status",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PaymentMethod"],
    }),

    // Create a new payment method CPF (Student access)
    createCPFPayment: builder.mutation<CreateCPFPaymentResponse, CreateCPFPaymentRequest>({
      query: (body) => ({
        url: "paymentmethodcpf/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentMethod"],
    }),
  }),
});

export const {
  useGetSecretaryCPFPaymentsQuery,
  useUpdateCPFStatusMutation,
  useCreateCPFPaymentMutation,
} = paymentMethodCPFApi;
