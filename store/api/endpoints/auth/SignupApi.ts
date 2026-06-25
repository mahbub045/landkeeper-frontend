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
  }),
  overrideExisting: false,
});

export const { useSignupMutation } = SignupApi;
