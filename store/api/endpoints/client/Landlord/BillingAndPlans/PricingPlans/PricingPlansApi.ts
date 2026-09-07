import { baseApi } from '@/store/api/baseApi';

export const PricingPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricingPlans: builder.query({
      query: () => ({
        url: '/subscription/plans',
        method: 'GET',
      }),
      providesTags: ['PricingPlans'],
    }),
    selectPricingPlan: builder.mutation({
      query: ({ payload }) => ({
        url: `/subscription/plans/select`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['PricingPlans'],
    }),
  }),
});

export const { useGetPricingPlansQuery, useSelectPricingPlanMutation } =
  PricingPlansApi;
