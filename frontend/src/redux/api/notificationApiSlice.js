import { apiSlice } from './apiSlice.js';
import { NOTIFICATION_URL } from '../constants.js'; // Assuming you have constants

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (unread = false) => `${NOTIFICATION_URL}${unread ? '?unread=true' : ''}`,
      providesTags: ['Notification'],
      keepUnusedDataFor: 30, // Cache for 30 seconds
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATION_URL}/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'], // Invalidate notification list after marking read
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationAsReadMutation } = notificationApiSlice;