import { baseApi } from '@/store/api/baseApi';
import {
  PricingPlansResponse,
  SelectPricingPlanRequest,
  SelectPricingPlanResponse,
} from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';

export const PricingPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricingPlans: builder.query<
      PricingPlansResponse,
      { coupon_code?: string } | void
    >({
      query: (arg) => ({
        url: '/subscription/plans',
        method: 'GET',
        params: arg ?? undefined,
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
    checkCouponValidity: builder.mutation({
      query: ({ coupon_code }) => ({
        url: `/referral/validate-coupon`,
        method: 'POST',
        body: { coupon_code },
      }),
    }),
  }),
});

export const {
  useGetPricingPlansQuery,
  useSelectPricingPlanMutation,
  useCheckCouponValidityMutation,
} = PricingPlansApi;
