import { baseApi } from '@/store/api/baseApi';

export const rentPaymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRentPayment: builder.mutation({
      query: (body) => ({
        url: '/tenant/rent-payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RentPayments'],
    }),

    payWithCard: builder.mutation({
      query: (body) => ({
        url: '/tenant/rent-payments/pay-with-card',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RentPayments'],
    }),

    payWithDirectDebit: builder.mutation({
      query: (body) => ({
        url: '/tenant/rent-payments/pay-with-direct-debit',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RentPayments'],
    }),
  }),
});

export const {
  useCreateRentPaymentMutation,
  usePayWithCardMutation,
  usePayWithDirectDebitMutation,
} = rentPaymentsApi;
