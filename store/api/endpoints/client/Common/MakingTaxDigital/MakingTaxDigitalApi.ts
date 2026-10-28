import { baseApi } from '@/store/api/baseApi';

export const MakingTaxDigitalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMTDReports: builder.query({
      query: (params) => ({
        url: `/mtd/reports`,
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useGetMTDReportsQuery } = MakingTaxDigitalApi;
