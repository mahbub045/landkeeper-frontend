import { baseApi } from '@/store/api/baseApi';

export const TeamAccessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query({
      query: () => ({
        url: '/organisation/users',
        method: 'GET',
      }),
      providesTags: ['TeamAccess'],
    }),
    getInviteTeamMember: builder.query({
      query: () => ({
        url: `/organisation/invite-users`,
        method: 'GET',
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
    editTeamMember: builder.mutation({
      query: ({ alias, ...body }) => ({
        url: `/team-access/members/${alias}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['TeamAccess'],
    }),
    deleteTeamMember: builder.mutation({
      query: (alias) => ({
        url: `/team-access/members/${alias}`,
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
  useEditTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = TeamAccessApi;
