import { baseApi } from '@/store/api/baseApi';

export const DocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantDocuments: builder.query({
      query: (params) => ({
        url: '/tenant/compliance-certificates',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useGetTenantDocumentsQuery } = DocumentsApi;
