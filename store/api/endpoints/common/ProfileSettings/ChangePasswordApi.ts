import { baseApi } from '../../../baseApi';

export const ChangePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/password/change',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = ChangePasswordApi;
