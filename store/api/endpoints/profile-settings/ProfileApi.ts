import { baseApi } from '../../baseApi';

export const ProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileInfo: builder.query({
        query: () => ({
            url: '/auth/profile',
            method: 'GET',
        }),
        providesTags: ['UserProfileAndSettings'],
    }),
  }),
});

export const { useGetProfileInfoQuery } = ProfileApi;