import { authApi } from '../../authApi';

export const SignupApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (request) => ({
        url: '/auth/register',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Signup'],
    }),
    emailVerify: builder.mutation({
      query: (request) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['EmailVerify'],
    }),
    resendVerify: builder.mutation({
      query: (request) => ({
        url: '/auth/resend-verify',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['ResendVerify'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignupMutation,
  useEmailVerifyMutation,
  useResendVerifyMutation,
} = SignupApi;
