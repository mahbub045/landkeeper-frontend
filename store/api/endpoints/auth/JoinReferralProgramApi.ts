import { authApi } from '../../authApi';

export const JoinReferralProgramApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    joinReferral: builder.mutation({
      query: () => ({
        url: '/auth/join-referral-program',
        method: 'POST',
      }),
      invalidatesTags: ['JoinReferralProgram'], 
    }),
  }),
  overrideExisting: false,
});

export const { useJoinReferralMutation } = JoinReferralProgramApi;
