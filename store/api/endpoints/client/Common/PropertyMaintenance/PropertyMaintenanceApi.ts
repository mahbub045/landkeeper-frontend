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
    getPropertyMaintenanceDetails: builder.query({
      query: (alias) => ({
        url: `/tenant/maintenance-requests/${alias}`,
        method: 'GET',
      }),
      providesTags: ['PropertyMaintenance'],
    }),
    maintenanceRequest: builder.mutation({
      query: ({ payload }) => ({
        url: `/tenant/maintenance-requests`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['PropertyMaintenance'],
    }),
    editPropertyMaintenance: builder.mutation({
      query: ({ alias, payload }) => ({
        url: `/tenant/maintenance-requests/${alias}`,
        method: 'PATCH',
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
  useGetPropertyMaintenanceDetailsQuery,
  useMaintenanceRequestMutation,
  useEditPropertyMaintenanceMutation,
  useDeletePropertyMaintenanceMutation,
} = PropertyMaintenanceApi;
