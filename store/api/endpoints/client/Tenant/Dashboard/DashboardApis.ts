import { baseApi } from '@/store/api/baseApi';

export const TenantDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyDetails: builder.query({
      query: () => ({
        url: '/tenant/dashboard/property-details',
      }),
      providesTags: ['TenantDashboardPropertyDetails'],
    }),
  }),
});

export const { useGetPropertyDetailsQuery } = TenantDashboardApi;
