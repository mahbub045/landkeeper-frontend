import { baseApi } from '@/store/api/baseApi';
import { CommonPermissions } from '@/types/common/Permissions/CommonPermissionsTypes';

export const CommonPermissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommonPermissions: builder.query<CommonPermissions, void>({
      query: () => ({
        url: '/subscription/permissions',
        method: 'GET',
      }),
      providesTags: ['CommonPermissions'],
    }),
  }),
});

export const { useGetCommonPermissionsQuery } = CommonPermissionsApi;
