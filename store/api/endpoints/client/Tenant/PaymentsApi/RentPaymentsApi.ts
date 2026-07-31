import { baseApi } from '@/store/api/baseApi';
import {
  ApiRentPayment,
  CreateRentPaymentPayload,
  PayWithCardPayload,
  PayWithCardResponse,
  PayWithDirectDebitPayload,
  PayWithDirectDebitResponse,
} from '@/types/client/Tenant/TenantTypes';

export const rentPaymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRentPayment: builder.mutation<
      ApiRentPayment,
      CreateRentPaymentPayload
    >({
      query: (body) => ({
        url: '/tenant/rent-payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RentPayments'],
    }),

    payWithCard: builder.mutation<PayWithCardResponse, PayWithCardPayload>({
      query: (body) => ({
        url: '/tenant/rent-payments/pay-with-card',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RentPayments'],
    }),

    payWithDirectDebit: builder.mutation<
      PayWithDirectDebitResponse,
      PayWithDirectDebitPayload
    >({
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
