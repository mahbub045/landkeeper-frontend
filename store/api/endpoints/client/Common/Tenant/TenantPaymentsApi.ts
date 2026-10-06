import { baseApi } from '@/store/api/baseApi';

export const TenantPaymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantPayments: builder.query({
      query: (params) => ({
        url: '/tenant/payments',
        method: 'GET',
        params,
      }),
      providesTags: ['Tenants'],
    }),
  }),
});

export const { useGetTenantPaymentsQuery } = TenantPaymentsApi;
