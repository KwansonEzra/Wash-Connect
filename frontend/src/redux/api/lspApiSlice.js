import { apiSlice } from './apiSlice.js';
import { LSP_URL } from '../constants.js';

export const lspApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLSPs: builder.query({
      query: ({ state, location, service, openNow } = {}) => ({
        url: LSP_URL,
        params: { state, location, service, openNow },
      }),
      providesTags: ['LSP'],
      keepUnusedDataFor: 5,
    }),
    getLSPById: builder.query({
      query: (id) => `${LSP_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'LSP', id }],
      keepUnusedDataFor: 5,
    }),
    // The logged-in LSP user's own profile. There's no way to know an LSP's
    // _id ahead of time on the client, so this hits a dedicated /mine
    // endpoint that looks the profile up by the authenticated owner.
    getMyLSP: builder.query({
      query: () => `${LSP_URL}/mine`,
      providesTags: ['LSP'],
      keepUnusedDataFor: 5,
    }),
    createLSP: builder.mutation({
      query: (data) => ({
        url: LSP_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LSP'],
    }),
    updateLSP: builder.mutation({
      query: (data) => ({
        url: `${LSP_URL}/mine`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['LSP'],
    }),
    updateLSPPricing: builder.mutation({
      query: (data) => ({
        url: `${LSP_URL}/mine/pricing`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['LSP'],
    }),
    updateLSPAvailability: builder.mutation({
      query: (data) => ({
        url: `${LSP_URL}/mine/availability`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['LSP'],
    }),
    verifyLSP: builder.mutation({
      query: ({ id, verified }) => ({
        url: `${LSP_URL}/${id}/verify`,
        method: 'PUT',
        body: { verified },
      }),
      invalidatesTags: ['LSP'],
    }),
  }),
});

export const {
  useGetLSPsQuery,
  useGetLSPByIdQuery,
  useGetMyLSPQuery,
  useCreateLSPMutation,
  useUpdateLSPMutation,
  useUpdateLSPPricingMutation,
  useUpdateLSPAvailabilityMutation,
  useVerifyLSPMutation,
} = lspApiSlice;
