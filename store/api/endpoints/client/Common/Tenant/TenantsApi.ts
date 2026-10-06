import { baseApi } from '@/store/api/baseApi';

export const TenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query({
      query: (params) => ({
        url: '/tenants',
        method: 'GET',
        params,
      }),
      providesTags: ['Tenants'],
    }),
    addTenants: builder.mutation({
      query: (payload) => ({
        url: '/tenants',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Tenants'],
    }),
    sendInvitation: builder.mutation({
      query: ({ tenant_alias }) => ({
        url: `/auth/tenants/${tenant_alias}/send-invite`,
        method: 'POST',
      }),
      invalidatesTags: ['Tenants'],
    }),
    acceptInvitation: builder.mutation({
      query: ({ payload, token }) => ({
        url: `/auth/tenants/${token}/accept-invite`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Tenants'],
    }),
    updateTenant: builder.mutation({
      query: ({ tenant_alias, payload }) => ({
        url: `/tenants/${tenant_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Tenants'],
    }),
    deleteTenant: builder.mutation({
      query: ({ tenant_alias }) => ({
        url: `/tenants/${tenant_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tenants'],
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
