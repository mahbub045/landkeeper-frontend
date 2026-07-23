import { baseApi } from '@/store/api/baseApi';
import { ApiSupportTicketType } from '@/types/common/SupportTickets/SupportTicketTypes';

export const SupportTicketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTickets: builder.query({
      query: (params) => ({
        url: '/support-tickets',
        method: 'GET',
        params,
      }),
      providesTags: ['SupportTickets'],
    }),
    addSupportTickets: builder.mutation({
      query: (payload) => ({
        url: '/support-tickets',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['SupportTickets'],
    }),
    getSupportTicketDetails: builder.query<
      ApiSupportTicketType,
      { ticket_alias: string }
    >({
      query: ({ ticket_alias }) => ({
        url: `/support-tickets/${ticket_alias}`,
        method: 'GET',
      }),
      providesTags: ['SupportTickets'],
    }),
    updateSupportTickets: builder.mutation({
      query: ({ ticket_alias, payload }) => ({
        url: `/support-tickets/${ticket_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['SupportTickets'],
    }),
    deleteSupportTickets: builder.mutation({
      query: ({ ticket_alias }) => ({
        url: `/support-tickets/${ticket_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupportTickets'],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useAddSupportTicketsMutation,
  useGetSupportTicketDetailsQuery,
  useUpdateSupportTicketsMutation,
  useDeleteSupportTicketsMutation,
} = SupportTicketsApi;
