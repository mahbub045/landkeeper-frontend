import { baseApi } from '../../../baseApi';

export const UpdatePasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/update-password',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['UserProfileAndSettings'],
    }),
  }),
});

export const { useUpdatePasswordMutation } = UpdatePasswordApi;
