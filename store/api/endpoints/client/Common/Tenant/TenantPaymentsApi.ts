import { baseApi } from '@/store/api/baseApi';
import { TenantPaymentListResponse } from '@/types/client/Common/Tenant/TenantsTypes';

export const TenantPaymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantPayments: builder.query<
      TenantPaymentListResponse,
      { page?: number; page_size?: number; search?: string } | undefined
    >({
      query: (params) => ({
        url: '/tenant/payments',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useGetTenantPaymentsQuery } = TenantPaymentsApi;
