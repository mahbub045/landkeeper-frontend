import { baseApi } from '@/store/api/baseApi';

export const TeamAccessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query({
      query: (params) => ({
        url: '/organisation/users',
        method: 'GET',
        params,
      }),
      providesTags: ['TeamAccess'],
    }),
    getInviteTeamMember: builder.query({
      query: (params) => ({
        url: `/organisation/invite-users`,
        method: 'GET',
        params,
      }),
      providesTags: ['TeamAccess'],
    }),
    inviteTeamMember: builder.mutation({
      query: (body) => ({
        url: '/auth/send/invites',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TeamAccess'],
    }),
    editAcceptedUser: builder.mutation({
      query: ({ alias, body }) => ({
        url: `/organisation/users/${alias}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['TeamAccess'],
    }),
    deleteAcceptedUser: builder.mutation({
      query: (alias) => ({
        url: `/organisation/users/${alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TeamAccess'],
    }),
    resendInviteEmail: builder.mutation({
      query: (alias) => ({
        url: `/auth/resend/invite/${alias}`,
        method: 'POST',
      }),
      invalidatesTags: ['TeamAccess'],
    }),
    deleteInvitedUser: builder.mutation({
      query: (alias) => ({
        url: `/auth/delete/invite/${alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TeamAccess'],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useGetInviteTeamMemberQuery,
  useInviteTeamMemberMutation,
  useEditAcceptedUserMutation,
  useDeleteAcceptedUserMutation,
  useResendInviteEmailMutation,
  useDeleteInvitedUserMutation,
} = TeamAccessApi;
