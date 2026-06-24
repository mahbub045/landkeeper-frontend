import { baseApi } from '../../../baseApi';

export const ProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileInfo: builder.query({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      providesTags: ['UserProfileAndSettings'],
    }),
    editProfileInfo: builder.mutation({
      query: (payload) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['UserProfileAndSettings'],
    }),
  }),
});

export const { useGetProfileInfoQuery, useEditProfileInfoMutation } =
  ProfileApi;
