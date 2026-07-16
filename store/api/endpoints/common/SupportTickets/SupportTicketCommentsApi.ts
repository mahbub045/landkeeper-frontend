import { baseApi } from '@/store/api/baseApi';
import { ApiSupportTicketComment } from '@/types/common/SupportTickets/SupportTicketTypes';

export const SupportTicketCommentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTicketComments: builder.query<
      ApiSupportTicketComment[],
      { ticket_alias: string }
    >({
      query: ({ ticket_alias }) => ({
        url: `/support-tickets/${ticket_alias}/comments`,
        method: 'GET',
      }),
      providesTags: ['SupportTicketComments'],
    }),
    addSupportTicketComment: builder.mutation<
      ApiSupportTicketComment,
      { ticket_alias: string; payload: FormData }
    >({
      query: ({ ticket_alias, payload }) => ({
        url: `/support-tickets/${ticket_alias}/comments`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['SupportTicketComments'],
    }),
    updateSupportTicketComment: builder.mutation<
      ApiSupportTicketComment,
      { ticket_alias: string; comment_alias: string; payload: FormData }
    >({
      query: ({ ticket_alias, comment_alias, payload }) => ({
        url: `/support-tickets/${ticket_alias}/comments/${comment_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['SupportTicketComments'],
    }),
    deleteSupportTicketComment: builder.mutation<
      void,
      { ticket_alias: string; comment_alias: string }
    >({
      query: ({ ticket_alias, comment_alias }) => ({
        url: `/support-tickets/${ticket_alias}/comments/${comment_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupportTicketComments'],
    }),
  }),
});

export const {
  useGetSupportTicketCommentsQuery,
  useAddSupportTicketCommentMutation,
  useUpdateSupportTicketCommentMutation,
  useDeleteSupportTicketCommentMutation,
} = SupportTicketCommentsApi;
