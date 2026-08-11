import { baseApi } from '@/store/api/baseApi';

export const PropertyMaintenanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyMaintenance: builder.query({
      query: (params) => ({
        url: `/tenant/maintenance-requests`,
        method: 'GET',
        params,
      }),
      providesTags: ['PropertyMaintenance'],
    }),
    maintenanceRequest: builder.mutation({
      query: ({ alias, payload }) => ({
        url: `/tenant/maintenance-requests/${alias}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['PropertyMaintenance'],
    }),
    updatePropertyMaintenance: builder.mutation({
      query: ({ alias, payload }) => ({
        url: `/tenant/maintenance-requests/${alias}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['PropertyMaintenance'],
    }),
    deletePropertyMaintenance: builder.mutation({
      query: (alias) => ({
        url: `/tenant/maintenance-requests/${alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PropertyMaintenance'],
    }),
  }),
});

export const {
  useGetPropertyMaintenanceQuery,
  useMaintenanceRequestMutation,
  useUpdatePropertyMaintenanceMutation,
  useDeletePropertyMaintenanceMutation,
} = PropertyMaintenanceApi;
