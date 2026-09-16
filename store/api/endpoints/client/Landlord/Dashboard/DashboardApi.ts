import { baseApi } from '@/store/api/baseApi';
import { DashboardData } from '@/types/client/Landlord/Dashboard/DashboardTypes';

export const DashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardData, void>({
      query: () => ({
        url: '/dashboard/landlord/summary',
        method: 'GET',
      }),
    }),
    getDashboardPropertyType: builder.query({
      query: () => ({
        url: '/dashboard/landlord/property-type',
        method: 'GET',
      }),
    }),
    getDashboardComplianceType: builder.query({
      query: () => ({
        url: '/dashboard/landlord/compliance-type',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardSummaryQuery,
  useGetDashboardPropertyTypeQuery,
  useGetDashboardComplianceTypeQuery,
} = DashboardApi;
