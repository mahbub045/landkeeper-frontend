import { baseApi } from '@/store/api/baseApi';

export const FinanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinance: builder.query({
      query: (params) => ({
        url: '/finance',
        method: 'GET',
        params,
      }),
      providesTags: ['Finance'],
    }),
    addFinance: builder.mutation({
      query: (payload) => ({
        url: '/finance',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Finance'],
    }),
    updateFinance: builder.mutation({
      query: ({ finance_alias, payload }) => ({
        url: `/finance/${finance_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Finance'],
    }),
    deleteFinance: builder.mutation({
      query: ({ finance_alias }) => ({
        url: `/finance/${finance_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Finance'],
    }),
  }),
});

export const {
  useGetFinanceQuery,
  useAddFinanceMutation,
  useUpdateFinanceMutation,
  useDeleteFinanceMutation,
} = FinanceApi;
