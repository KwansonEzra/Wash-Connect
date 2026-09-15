import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include', // Important for JWT cookies
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'LSP', 'Booking', 'Location', 'Notification', 'Review', 'ServiceCategory'],
  endpoints: () => ({}),
});