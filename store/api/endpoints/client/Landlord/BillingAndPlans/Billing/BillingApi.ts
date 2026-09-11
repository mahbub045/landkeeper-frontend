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
    billingHistory: builder.query({
      query: (params) => ({
        url: `/subscription/billing-history`,
        method: 'GET',
        params,
      }),
      providesTags: ['BillingDetails'],
    }),
  }),
});

export const {
  useSubscriptionPlanDetailsQuery,
  useUpdateAutoRenewMutation,
  useBillingHistoryQuery,
} = BillingApi;
