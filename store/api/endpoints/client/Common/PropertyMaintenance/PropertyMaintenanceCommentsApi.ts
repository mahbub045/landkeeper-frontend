import { baseApi } from '@/store/api/baseApi';
import { ApiPropertyMaintenanceComment } from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';

export const PropertyMaintenanceCommentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyMaintenanceComments: builder.query<
      ApiPropertyMaintenanceComment[],
      { pm_alias: string }
    >({
      query: ({ pm_alias }) => ({
        url: `/tenant/maintenance-requests/${pm_alias}/comments`,
        method: 'GET',
      }),
      providesTags: ['PropertyMaintenanceComments'],
    }),
    addPropertyMaintenanceComment: builder.mutation<
      ApiPropertyMaintenanceComment,
      { pm_alias: string; payload: FormData }
    >({
      query: ({ pm_alias, payload }) => ({
        url: `/tenant/maintenance-requests/${pm_alias}/comments`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['PropertyMaintenanceComments'],
    }),
    updatePropertyMaintenanceComment: builder.mutation<
      ApiPropertyMaintenanceComment,
      { pm_alias: string; comment_alias: string; payload: FormData }
    >({
      query: ({ pm_alias, comment_alias, payload }) => ({
        url: `/tenant/maintenance-requests/${pm_alias}/comments/${comment_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['PropertyMaintenanceComments'],
    }),
    deletePropertyMaintenanceComment: builder.mutation<
      void,
      { pm_alias: string; comment_alias: string }
    >({
      query: ({ pm_alias, comment_alias }) => ({
        url: `/tenant/maintenance-requests/${pm_alias}/comments/${comment_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PropertyMaintenanceComments'],
    }),
  }),
});

export const {
  useGetPropertyMaintenanceCommentsQuery,
  useAddPropertyMaintenanceCommentMutation,
  useUpdatePropertyMaintenanceCommentMutation,
  useDeletePropertyMaintenanceCommentMutation,
} = PropertyMaintenanceCommentsApi;
