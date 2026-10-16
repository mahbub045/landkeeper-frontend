import { baseApi } from '@/store/api/baseApi';

export const SystemUserJoinReferralProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    systemUserJoinReferralProgram: builder.mutation({
      query: () => ({
        url: '/referral/join',
        method: 'POST',
      }),
      invalidatesTags: ['UserProfileAndSettings'],
    }),
  }),
});

export const { useSystemUserJoinReferralProgramMutation } =
  SystemUserJoinReferralProgramApi;
