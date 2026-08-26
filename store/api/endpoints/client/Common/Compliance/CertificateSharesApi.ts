import { baseApi } from '@/store/api/baseApi';

export const CertificateSharesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCertificateShares: builder.query({
      query: ({ certificateAlias, params }) => ({
        url: `/compliance-certificates/${certificateAlias}/share`,
        method: 'GET',
        params,
      }),
      providesTags: ['CertificateShares'],
    }),
    getTenantFilterList: builder.query({
      query: (params) => ({
        url: '/tenant/list',
        method: 'GET',
        params,
      }),
      providesTags: ['CertificateShares'],
    }),
    addNewShare: builder.mutation({
      query: ({ certificateAlias, payload }) => ({
        url: `/compliance-certificates/${certificateAlias}/share`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['CertificateShares'],
    }),
    deleteShare: builder.mutation({
      query: ({ certificateAlias, shareAlias }) => ({
        url: `/compliance-certificates/${certificateAlias}/share/${shareAlias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CertificateShares'],
    }),
  }),
});

export const {
  useGetCertificateSharesQuery,
  useGetTenantFilterListQuery,
  useAddNewShareMutation,
  useDeleteShareMutation,
} = CertificateSharesApi;
