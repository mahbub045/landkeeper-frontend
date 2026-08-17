import { baseApi } from '@/store/api/baseApi';

export const PermissionsApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPermission: builder.mutation({
      query: (payload) => ({
        url: `/permissions`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Permissions'],
    }),

    updatePermission: builder.mutation({
      query: ({ alias, payload }) => ({
        url: `/permissions/${alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Permissions'],
    }),

    deletePermission: builder.mutation({
      query: ({ alias }) => ({
        url: `/permissions/${alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permissions'],
    }),
  }),
});

export const {
  useAddPermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = PermissionsApis;
