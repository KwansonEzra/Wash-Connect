import { apiSlice } from './apiSlice.js';
import { BOOKING_URL } from '../constants.js'; // Assuming you have constants

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: BOOKING_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking'], // Invalidate user's bookings list
    }),
    getMyBookings: builder.query({
      query: () => `${BOOKING_URL}/mine`,
      providesTags: ['Booking'],
      keepUnusedDataFor: 5,
    }),
    getLSPBookings: builder.query({
      query: () => `${BOOKING_URL}/lsp`,
      providesTags: ['Booking'],
      keepUnusedDataFor: 5,
    }),
    getBookingById: builder.query({
      query: (id) => `${BOOKING_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
      keepUnusedDataFor: 5,
    }),
    acceptBooking: builder.mutation({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Booking', id: arg }, // Invalidate specific booking
        'Booking', // Invalidate general booking lists
      ],
    }),
    declineBooking: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${BOOKING_URL}/${id}/decline`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Booking', id: arg.id }, // Invalidate specific booking
        'Booking', // Invalidate general booking lists
      ],
    }),
    completeBooking: builder.mutation({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}/complete`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Booking', id: arg }, // Invalidate specific booking
        'Booking', // Invalidate general booking lists
      ],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Booking', id: arg }, // Invalidate specific booking
        'Booking', // Invalidate general booking lists
      ],
    }),
  }),
});

export const { useCreateBookingMutation, useGetMyBookingsQuery, useGetLSPBookingsQuery, useGetBookingByIdQuery, useAcceptBookingMutation, useDeclineBookingMutation, useCompleteBookingMutation, useCancelBookingMutation } = bookingApiSlice;