import { apiSlice } from './apiSlice.js';
import { USER_URL } from '../constants.js';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${USER_URL}/auth`,
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USER_URL,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: 'POST',
      }),
    }),
    getProfile: builder.query({
      query: () => `${USER_URL}/profile`,
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = usersApiSlice;
