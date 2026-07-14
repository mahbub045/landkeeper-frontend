import { baseApi } from '@/store/api/baseApi';

export const TenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query({
      query: (params) => ({
        url: '/tenants',
        method: 'GET',
        params,
      }),
      providesTags: ['Tenant'],
    }),
    addTenants: builder.mutation({
      query: (payload) => ({
        url: '/tenants',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Tenant'],
    }),
    sendInvitation: builder.mutation({
      query: ({ tenant_alias }) => ({
        url: `/auth/tenants/${tenant_alias}/send-invite`,
        method: 'POST',
      }),
      invalidatesTags: ['Tenant'],
    }),
    acceptInvitation: builder.mutation({
      query: ({ payload, token }) => ({
        url: `/auth/tenants/${token}/accept-invite`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Tenant'],
    }),
    updateTenant: builder.mutation({
      query: ({ tenant_alias, payload }) => ({
        url: `/tenants/${tenant_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Tenant'],
    }),
    deleteTenant: builder.mutation({
      query: ({ tenant_alias }) => ({
        url: `/tenants/${tenant_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tenant'],
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useAddTenantsMutation,
  useSendInvitationMutation,
  useAcceptInvitationMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} = TenantApi;
