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
    // subscriptionValidation: builder.mutation({
    //   query: (payload) => ({
    //     url: `/subscription/validation`,
    //     method: 'POST',
    //     body: payload,
    //   }),
    //   invalidatesTags: ['PricingPlans'],
    // }),
  }),
});

export const { useGetPricingPlansQuery, useSelectPricingPlanMutation } =
  PricingPlansApi;
