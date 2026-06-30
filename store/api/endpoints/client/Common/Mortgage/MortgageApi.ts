import { baseApi } from '@/store/api/baseApi';

export const MortgageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMortgages: builder.query({
      query: (params) => ({
        url: '/mortgage',
        method: 'GET',
        params,
      }),
      providesTags: ['Mortgage'],
    }),
    addMortgages: builder.mutation({
      query: (payload) => ({
        url: '/mortgage',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Mortgage'],
    }),
    updateMortgage: builder.mutation({
      query: ({ mortgage_alias, payload }) => ({
        url: `/mortgage/${mortgage_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Mortgage'],
    }),
    deleteMortgage: builder.mutation({
      query: ({ mortgage_alias }) => ({
        url: `/mortgage/${mortgage_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Mortgage'],
    }),
  }),
});

export const {
  useGetMortgagesQuery,
  useAddMortgagesMutation,
  useUpdateMortgageMutation,
  useDeleteMortgageMutation,
} = MortgageApi;
