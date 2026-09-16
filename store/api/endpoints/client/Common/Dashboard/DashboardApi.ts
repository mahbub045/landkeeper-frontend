import { baseApi } from '@/store/api/baseApi';
import {
  ComplianceTypesResponse,
  DashboardData,
  PropertyTypesResponse,
} from '@/types/client/Common/Dashboard/DashboardTypes';

export const DashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardData, void>({
      query: () => ({
        url: '/dashboard/summary',
        method: 'GET',
      }),
    }),
    getDashboardPropertyTypes: builder.query<PropertyTypesResponse, void>({
      query: () => ({
        url: '/dashboard/property-types',
        method: 'GET',
      }),
    }),
    getDashboardComplianceTypes: builder.query<ComplianceTypesResponse, void>({
      query: () => ({
        url: '/dashboard/compliance-types',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardSummaryQuery,
  useGetDashboardPropertyTypesQuery,
  useGetDashboardComplianceTypesQuery,
} = DashboardApi;
