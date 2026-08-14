import { baseApi } from '@/store/api/baseApi';

export const PropertyPermissionApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyPermissions: builder.query({
      query: (property_alias) => ({
        url: `/property/${property_alias}/permissions`,
        method: 'GET',
      }),
      providesTags: ['PropertyPermission'],
    }),

    updatePropertyPermission: builder.mutation({
      query: ({ property_alias, permission_id, payload }) => ({
        url: `/property/${property_alias}/permissions/${permission_id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['PropertyPermission'],
    }),
  }),
});

export const {
  useGetPropertyPermissionsQuery,
  useUpdatePropertyPermissionMutation,
} = PropertyPermissionApis;
