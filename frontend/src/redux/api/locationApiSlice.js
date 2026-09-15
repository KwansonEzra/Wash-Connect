import { apiSlice } from './apiSlice.js';
import { LOCATION_URL } from '../constants.js';

export const locationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStates: builder.query({
      query: () => `${LOCATION_URL}/states`,
      providesTags: ['Location'],
      keepUnusedDataFor: 300, // Cache for 5 minutes, states don't change often
    }),
    getLocationsByStateId: builder.query({
      query: (stateId) => `${LOCATION_URL}?state=${stateId}`,
      providesTags: (result, error, stateId) => [{ type: 'Location', stateId }],
      keepUnusedDataFor: 300,
    }),
    createState: builder.mutation({
      query: (data) => ({
        url: `${LOCATION_URL}/states`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Location'],
    }),
    updateState: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${LOCATION_URL}/states/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Location'],
    }),
    deleteState: builder.mutation({
      query: (id) => ({
        url: `${LOCATION_URL}/states/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Location'],
    }),
    createLocation: builder.mutation({
      query: (data) => ({
        url: LOCATION_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Location'],
    }),
    updateLocation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${LOCATION_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Location'],
    }),
    deleteLocation: builder.mutation({
      query: (id) => ({
        url: `${LOCATION_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Location'],
    }),
  }),
});

export const {
  useGetStatesQuery,
  useGetLocationsByStateIdQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationApiSlice;
