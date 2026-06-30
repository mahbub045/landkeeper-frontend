import { baseApi } from '../../../baseApi';

export const ChangePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = ChangePasswordApi;
