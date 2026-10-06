import { baseApi } from '../../baseApi';

export const AuthUserListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthUserList: builder.query({
      query: (params) => ({
        url: `/auth/users`,
        method: 'GET',
        params,
      }),
      providesTags: ['AuthUserList'],
    }),
  }),
});

export const { useGetAuthUserListQuery } = AuthUserListApi;
