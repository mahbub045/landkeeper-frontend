import { baseApi } from '@/store/api/baseApi';

export const BillingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscriptionPlanDetails: builder.query({
      query: () => ({
        url: `/subscription`,
        method: 'GET',
      }),
      providesTags: ['BillingDetails'],
    }),
    updateAutoRenew: builder.mutation({
      query: ({ auto_renew }) => ({
        url: `/subscription`,
        method: 'PATCH',
        body: { auto_renew },
      }),
      invalidatesTags: ['BillingDetails'],
    }),
    cancelPendingDowngrade: builder.mutation({
      query: () => ({
        url: `/subscription/cancel-pending-downgrade`,
        method: 'POST',
      }),
      invalidatesTags: ['BillingDetails'],
    }),
    billingHistory: builder.query({
      query: (params) => ({
        url: `/subscription/billing-history`,
        method: 'GET',
        params,
      }),
      providesTags: ['BillingDetails'],
    }),
    paymewntMethods: builder.query({
      query: () => ({
        url: `/subscription/cards`,
        method: 'GET',
      }),
      providesTags: ['BillingDetails'],
    }),
    addPaymentMethod: builder.mutation({
      query: ({ payment_method_id, is_default }) => ({
        url: `/subscription/cards`,
        method: 'POST',
        body: { payment_method_id, is_default },
      }),
      invalidatesTags: ['BillingDetails'],
    }),
    updatePaymentMethod: builder.mutation({
      query: ({ card_alias, is_default }) => ({
        url: `/subscription/cards/${card_alias}`,
        method: 'PATCH',
        body: { is_default },
      }),
      invalidatesTags: ['BillingDetails'],
    }),
    deletePaymentMethod: builder.mutation({
      query: ({ card_alias }) => ({
        url: `/subscription/cards/${card_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BillingDetails'],
    }),
  }),
});

export const {
  useSubscriptionPlanDetailsQuery,
  useUpdateAutoRenewMutation,
  useCancelPendingDowngradeMutation,
  useBillingHistoryQuery,
  usePaymewntMethodsQuery,
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = BillingApi;
