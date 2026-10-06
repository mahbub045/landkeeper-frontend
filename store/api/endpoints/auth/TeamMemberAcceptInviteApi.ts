import { authApi } from '../../authApi';

export const TeamMemberAcceptInviteApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    acceptTeamMemberInvite: builder.mutation({
      query: ({ payload, token }) => ({
        url: `/auth/accept-invite/${token}`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useAcceptTeamMemberInviteMutation } = TeamMemberAcceptInviteApi;
