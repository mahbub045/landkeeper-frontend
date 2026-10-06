import { baseApi } from '@/store/api/baseApi';

export const ComplianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompliances: builder.query({
      query: (params) => ({
        url: '/compliance',
        method: 'GET',
        params,
      }),
      providesTags: ['Compliance'],
    }),
    addCompliances: builder.mutation({
      query: (payload) => ({
        url: '/compliance',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Compliance'],
    }),
    updateCompliance: builder.mutation({
      query: ({ compliance_alias, payload }) => ({
        url: `/compliance/${compliance_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Compliance'],
    }),
    deleteCompliance: builder.mutation({
      query: ({ compliance_alias }) => ({
        url: `/compliance/${compliance_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Compliance'],
    }),
  }),
});

export const {
  useGetCompliancesQuery,
  useAddCompliancesMutation,
  useUpdateComplianceMutation,
  useDeleteComplianceMutation,
} = ComplianceApi;
