import { apiSlice } from './apiSlice.js';
import { SERVICE_CATALOG_URL } from '../constants.js';

export const serviceCatalogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServiceCategories: builder.query({
      query: () => SERVICE_CATALOG_URL,
      providesTags: ['ServiceCategory'],
      keepUnusedDataFor: 300,
    }),
    getServiceCategoryById: builder.query({
      query: (id) => `${SERVICE_CATALOG_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'ServiceCategory', id }],
    }),
    createServiceCategory: builder.mutation({
      query: (data) => ({
        url: SERVICE_CATALOG_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ServiceCategory'],
    }),
    updateServiceCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${SERVICE_CATALOG_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ServiceCategory'],
    }),
    deleteServiceCategory: builder.mutation({
      query: (id) => ({
        url: `${SERVICE_CATALOG_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceCategory'],
    }),
  }),
});

export const {
  useGetServiceCategoriesQuery,
  useGetServiceCategoryByIdQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} = serviceCatalogApiSlice;
