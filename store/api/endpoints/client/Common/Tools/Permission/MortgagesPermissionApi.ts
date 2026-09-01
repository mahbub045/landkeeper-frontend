import { baseApi } from '@/store/api/baseApi';

export const MortgagesPermissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addMortgagePermission: builder.mutation({
      query: ({ userAlias, payload }) => ({
        url: `/permissions/user/${userAlias}/bulk-mortgage`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Permission'],
    }),
    getMortgagesForPermission: builder.query({
      query: ({ userAlias, params }) => ({
        url: `/permissions/user/${userAlias}/bulk-mortgage`,
        method: 'GET',
        params,
      }),
      providesTags: ['Permission'],
    }),
  }),
});

export const {
  useGetMortgagesForPermissionQuery,
  useAddMortgagePermissionMutation,
} = MortgagesPermissionApi;
