import { baseApi } from '@/store/api/baseApi';

export const MakingTaxDigitalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMTDReports: builder.query({
      query: (params) => ({
        url: `/mtd/reports`,
        method: 'GET',
        params,
      }),
      providesTags: ['MTD'],
    }),
    selectMTDProperties: builder.mutation({
      query: ({ reportAlias, payload }) => ({
        url: `/mtd/reports/${reportAlias}/properties`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['MTD'],
    }),
    getMTDIncomeExpenses: builder.query({
      query: ({ reportAlias }) => ({
        url: `/mtd/reports/${reportAlias}/income-expenses`,
        method: 'GET',
      }),
      providesTags: ['MTD'],
    }),
    getMTDFinanceCosts: builder.query({
      query: ({ reportAlias }) => ({
        url: `/mtd/reports/${reportAlias}/finance-costs`,
        method: 'GET',
      }),
      providesTags: ['MTD'],
    }),
    updateMTDFinanceCosts: builder.mutation({
      query: ({ reportAlias, payload, financeCostAlias }) => ({
        url: `/mtd/reports/${reportAlias}/finance-costs/${financeCostAlias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['MTD'],
    }),
    getMTDSummary: builder.query({
      query: ({ reportAlias }) => ({
        url: `/mtd/reports/${reportAlias}/summary`,
        method: 'GET',
      }),
      providesTags: ['MTD'],
    }),
    dowloadMTDReport: builder.mutation({
      query: ({ reportAlias, payload }) => ({
        url: `/mtd/reports/${reportAlias}/download`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetMTDReportsQuery,
  useSelectMTDPropertiesMutation,
  useGetMTDIncomeExpensesQuery,
  useGetMTDFinanceCostsQuery,
  useUpdateMTDFinanceCostsMutation,
  useGetMTDSummaryQuery,
  useDowloadMTDReportMutation,
} = MakingTaxDigitalApi;
