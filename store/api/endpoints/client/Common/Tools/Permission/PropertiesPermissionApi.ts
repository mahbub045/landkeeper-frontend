import { baseApi } from '@/store/api/baseApi';

export const PropertyPermissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertiesForPermission: builder.query({
      query: ({ userAlias, params }) => ({
        url: `/permissions/user/${userAlias}/bulk-property`,
        method: 'GET',
        params,
      }),
      providesTags: ['Permission'],
    }),
    addPropertiesPermission: builder.mutation({
      query: ({ userAlias, payload }) => ({
        url: `/permissions/user/${userAlias}/bulk-property`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Permission'],
    }),
  }),
});

export const {
  useGetPropertiesForPermissionQuery,
  useAddPropertiesPermissionMutation,
} = PropertyPermissionApi;
