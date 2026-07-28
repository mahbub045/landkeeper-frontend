import { baseApi } from '@/store/api/baseApi';

export const paymentMethodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setupDirectDebit: builder.mutation({
      query: (body) => ({
        url: '/tenant/payment-methods/direct-debit/setup',
        method: 'POST',
        body,
      }),
    }),

    completeDirectDebit: builder.mutation({
      query: (body) => ({
        url: '/tenant/payment-methods/direct-debit/complete',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PaymentMethods'],
    }),

    getPaymentMethods: builder.query({
      query: () => "/tenant/payment-methods",
      transformResponse: (response) => response.results,
      providesTags: ["PaymentMethods"],
    }),
  }),
});

export const {
  useSetupDirectDebitMutation,
  useCompleteDirectDebitMutation,
  useGetPaymentMethodsQuery,
} = paymentMethodsApi;
