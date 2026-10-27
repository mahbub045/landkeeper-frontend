import { baseApi } from '@/store/api/baseApi';
import {
  AlertsRemindersResponse,
  ComplianceTypesResponse,
  DashboardData,
  IncomeExpenseMonths,
  IncomeExpenseResponse,
  PropertyTypesResponse,
} from '@/types/client/Common/Dashboard/DashboardTypes';

export const DashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardData, void>({
      query: () => ({
        url: '/dashboard/summary',
        method: 'GET',
      }),
      providesTags: ['DashboardSummary'],
    }),
    getDashboardPropertyTypes: builder.query<PropertyTypesResponse, void>({
      query: () => ({
        url: '/dashboard/property-types',
        method: 'GET',
      }),
      providesTags: ['DashboardSummary'],
    }),
    getDashboardComplianceTypes: builder.query<ComplianceTypesResponse, void>({
      query: () => ({
        url: '/dashboard/compliance-types',
        method: 'GET',
      }),
      providesTags: ['DashboardSummary'],
    }),
    getDashboardIncomeExpense: builder.query<
      IncomeExpenseResponse,
      { months: IncomeExpenseMonths }
    >({
      query: (params) => ({
        url: '/dashboard/income-expense',
        method: 'GET',
        params,
      }),
      providesTags: ['DashboardSummary'],
    }),
    getAlertsAndReminders: builder.query<AlertsRemindersResponse, void>({
      query: () => ({
        url: '/dashboard/alerts',
        method: 'GET',
      }),
      providesTags: ['DashboardSummary'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardSummaryQuery,
  useGetDashboardPropertyTypesQuery,
  useGetDashboardComplianceTypesQuery,
  useGetDashboardIncomeExpenseQuery,
  useGetAlertsAndRemindersQuery,
} = DashboardApi;
