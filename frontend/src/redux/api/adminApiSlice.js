import { apiSlice } from './apiSlice.js';
import { ADMIN_URL } from '../constants.js';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query({
      query: () => `${ADMIN_URL}/metrics`,
      providesTags: ['Booking', 'LSP', 'User'],
      keepUnusedDataFor: 30,
    }),
    getAllUsers: builder.query({
      query: () => `${ADMIN_URL}/users`,
      providesTags: ['User'],
      keepUnusedDataFor: 30,
    }),
    getAllLSPs: builder.query({
      query: () => `${ADMIN_URL}/lsps`,
      providesTags: ['LSP'],
      keepUnusedDataFor: 30,
    }),
    getPendingLSPs: builder.query({
      query: () => `${ADMIN_URL}/lsps/pending`,
      providesTags: ['LSP'],
      keepUnusedDataFor: 5,
    }),
    getAllBookings: builder.query({
      query: () => `${ADMIN_URL}/bookings`,
      providesTags: ['Booking'],
      keepUnusedDataFor: 30,
    }),
  }),
});

export const {
  useGetMetricsQuery,
  useGetAllUsersQuery,
  useGetAllLSPsQuery,
  useGetPendingLSPsQuery,
  useGetAllBookingsQuery,
} = adminApiSlice;
