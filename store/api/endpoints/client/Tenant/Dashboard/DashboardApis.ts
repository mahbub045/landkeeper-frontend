import { baseApi } from '@/store/api/baseApi';
import { TenantPropertyDetails } from '@/types/client/Tenant/Dashboard/DashboardsTypes';

export const TenantDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyDetails: builder.query<TenantPropertyDetails, void>({
      query: () => ({
        url: '/tenant/property',
      }),
      providesTags: ['TenantDashboardPropertyDetails'],
    }),
  }),
});

export const { useGetPropertyDetailsQuery } = TenantDashboardApi;
