import { baseApi } from '@/store/api/baseApi';

export const PermissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertiesForPermission: builder.query({
      query: (userAlias) => ({
        url: `/permissions/user/${userAlias}/bulk-property`,
        method: 'GET',
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
    addMortgagePermission: builder.mutation({
      query: ({ userAlias, payload }) => ({
        url: `/permissions/user/${userAlias}/bulk-mortgage`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Permission'],
    }),
    getMortgagesForPermission: builder.query({
      query: (userAlias) => ({
        url: `/permissions/user/${userAlias}/bulk-mortgage`,
        method: 'GET',
      }),
      providesTags: ['Permission'],
    }),
  }),
});

export const {
  useGetPropertiesForPermissionQuery,
  useAddPropertiesPermissionMutation,
  useGetMortgagesForPermissionQuery,
  useAddMortgagePermissionMutation,
} = PermissionApi;
