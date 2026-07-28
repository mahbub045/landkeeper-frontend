import { baseApi } from '@/store/api/baseApi';

export const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: '/notifications',
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),
    unreadNotificationCount: builder.query({
      query: () => ({
        url: '/notifications/unread-count',
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),
    readNotification: builder.mutation({
      query: (notificationId: string) => ({
        url: `/notifications/${notificationId}/mark-as-read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
    allReadNotification: builder.mutation({
      query: () => ({
        url: '/notifications/mark-all-as-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUnreadNotificationCountQuery,
  useReadNotificationMutation,
  useAllReadNotificationMutation,
} = NotificationApi;
