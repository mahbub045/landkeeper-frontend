import { authApi } from '../../authApi';

export const JoinReferralProgramApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    joinReferral: builder.mutation({
      query: (payload) => ({
        url: '/auth/join-referral-program',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['JoinReferralProgram'], 
    }),
  }),
  overrideExisting: false,
});

export const { useJoinReferralMutation } = JoinReferralProgramApi;
