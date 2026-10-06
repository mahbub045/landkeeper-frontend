import { baseApi } from '@/store/api/baseApi';

export const TenantDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyAndTenancyDetails: builder.query({
      query: () => ({
        url: '/tenant/property-and-tenancy-details',
        method: 'GET',
      }),
    }),
    getFinancialOverview: builder.query({
      query: () => ({
        url: '/tenant/financial-overview',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetPropertyAndTenancyDetailsQuery,
  useGetFinancialOverviewQuery,
} = TenantDashboardApi;
