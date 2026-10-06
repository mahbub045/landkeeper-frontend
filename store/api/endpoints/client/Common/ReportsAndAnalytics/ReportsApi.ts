import { baseApi } from '@/store/api/baseApi';

export const ReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioReports: builder.mutation({
      query: (params) => ({
        url: '/properties-portfolio',
        method: 'GET',
        params,
        responseHandler: async (response: Response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetPortfolioReportsMutation } = ReportsApi;
