import { baseApi } from '@/store/api/baseApi';
import { ReportDateRangeParams } from '@/types/client/Common/ReportsAndAnalytics/ReportsType';

export const ReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    downloadPortfolioReports: builder.mutation({
      query: (params) => ({
        url: '/report/properties-portfolio',
        method: 'GET',
        params,
        responseHandler: async (response: Response) => response.blob(),
      }),
    }),
    downloadIncomeReports: builder.mutation<Blob, ReportDateRangeParams>({
      query: (params) => ({
        url: '/report/income',
        method: 'GET',
        params,
        responseHandler: async (response: Response) => response.blob(),
      }),
    }),
    downloadExpenseReports: builder.mutation<Blob, ReportDateRangeParams>({
      query: (params) => ({
        url: '/report/expense',
        method: 'GET',
        params,
        responseHandler: async (response: Response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useDownloadPortfolioReportsMutation,
  useDownloadIncomeReportsMutation,
  useDownloadExpenseReportsMutation,
} = ReportsApi;
