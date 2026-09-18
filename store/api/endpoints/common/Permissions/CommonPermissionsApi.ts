import { baseApi } from '@/store/api/baseApi';

export const CommonPermissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommonPermissions: builder.query({
      query: () => ({
        url: '/subscription/permissions',
        method: 'GET',
      }),
      providesTags: ['CommonPermissions'],
    }),
  }),
});

export const { useGetCommonPermissionsQuery } = CommonPermissionsApi;
