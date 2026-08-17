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
      query: ({ content_alias, payload }) => ({
        url: `/permissions/${content_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Permissions'],
    }),
  }),
});

export const { useAddPermissionMutation, useUpdatePermissionMutation } =
  PermissionsApis;
