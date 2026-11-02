import { baseApi } from '@/store/api/baseApi';

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
  }),
});

export const { useDownloadPortfolioReportsMutation } = ReportsApi;
