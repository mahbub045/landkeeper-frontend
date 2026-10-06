import { authApi } from '../../authApi';

export const ForgotPasswordApi = authApi.injectEndpoints({
  endpoints: (build) => ({
    forgotPassword: build.mutation({
      query: (payload) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),
    setPassword: build.mutation({
      query: ({ payload, uid, token }) => ({
        url: `/auth/set-password/${uid}/${token}`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation, useSetPasswordMutation } =
  ForgotPasswordApi;
