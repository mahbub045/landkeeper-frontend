import { baseApi } from '@/store/api/baseApi';

interface GetPortfolioReportsParams {
  export_format: 'pdf' | 'xlsx';
}

export const ReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioReports: builder.mutation<Blob, GetPortfolioReportsParams>({
      query: (params) => ({
        url: '/properties-portfolio',
        method: 'GET',
        params,
        responseHandler: async (response: Response) => response.blob(),
        cache: 'no-cache',
      }),
    }),
  }),
});

export const { useGetPortfolioReportsMutation } = ReportsApi;