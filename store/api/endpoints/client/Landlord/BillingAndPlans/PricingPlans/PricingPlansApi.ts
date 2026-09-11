import { baseApi } from '@/store/api/baseApi';
import {
  SelectPricingPlanRequest,
  SelectPricingPlanResponse,
} from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';

export const PricingPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricingPlans: builder.query({
      query: () => ({
        url: '/subscription/plans',
        method: 'GET',
      }),
      providesTags: ['PricingPlans'],
    }),
    selectPricingPlan: builder.mutation<
      SelectPricingPlanResponse,
      { payload: SelectPricingPlanRequest }
    >({
      query: ({ payload }) => ({
        url: `/subscription/plans/select`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['PricingPlans'],
    }),
    subscriptionPlanDetails: builder.query({
      query: () => ({
        url: `/subscription`,
        method: 'GET',
      }),
      providesTags: ['PricingPlans'],
    }),
    updateAutoRenew: builder.mutation({
      query: ({ auto_renew }) => ({
        url: `/subscription`,
        method: 'PATCH',
        body: { auto_renew },
      }),
      invalidatesTags: ['PricingPlans'],
    }),
  }),
});

export const {
  useGetPricingPlansQuery,
  useSelectPricingPlanMutation,
  useSubscriptionPlanDetailsQuery,
  useUpdateAutoRenewMutation,
} = PricingPlansApi;
