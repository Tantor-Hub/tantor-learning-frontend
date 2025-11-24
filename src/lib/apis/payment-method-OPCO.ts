import { createApi, enhancedBaseQuery } from "./base-api";
import {
  OPCOSPaymentResponse,
  UpdateOPCOStatusRequest,
  UpdateOPCOStatusResponse,
  CreateOPCOSPaymentRequest,
  CreateOPCOSPaymentResponse,
  UpdateOPCOPaymentRequest,
  UpdateOPCOPaymentResponse,
  GetOPCOPaymentResponse,
  GetOPCOPaymentByIdResponse,
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
    updateOPCOStatus: builder.mutation<void, UpdateOPCOStatusRequest>({
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

    // Update a payment method OPCO (Secretary access)
    updateOPCOPayment: builder.mutation<UpdateOPCOPaymentResponse, UpdateOPCOPaymentRequest>({
      query: (body) => {
        const { id, ...updateFields } = body;
        return {
          url: `paymentmethodopco/secretary/update/${id}`,
          method: "PATCH",
          body: updateFields,
        };
      },
      invalidatesTags: ["PaymentMethod"],
    }),

    // Get a single OPCO payment by ID
    getOPCOPaymentById: builder.query<GetOPCOPaymentByIdResponse, string>({
      query: (id) => ({
        url: `paymentmethodopco/${id}`,
        method: "GET",
      }),
      providesTags: ["PaymentMethod"],
    }),
  }),
});

export const {
  useGetSecretaryOPCOPaymentsQuery,
  useUpdateOPCOStatusMutation,
  useCreateOPCOPaymentMutation,
  useUpdateOPCOPaymentMutation,
  useGetOPCOPaymentByIdQuery,
  useLazyGetOPCOPaymentByIdQuery,
} = paymentMethodOPCOApi;
