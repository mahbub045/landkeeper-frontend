import { baseApi } from '@/store/api/baseApi';

export const JoinReferralProgramApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    joinReferralProgram: builder.mutation({
      query: () => ({
        url: '/referral/join',
        method: 'POST',
      }),
      invalidatesTags: ['UserProfileAndSettings'],
    }),
  }),
});

export const { useJoinReferralProgramMutation } = JoinReferralProgramApi;
