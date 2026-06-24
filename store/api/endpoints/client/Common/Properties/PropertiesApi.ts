import { baseApi } from '@/store/api/baseApi';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';

export const PropertiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: () => ({ url: '/property', method: 'GET' }),
      transformResponse: (res: unknown) =>
        (res as { results: Property[] }).results,
      providesTags: ['Property'],
    }),
    addProperties: builder.mutation({
      query: (payload) => ({
        url: '/property',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Property'],
    }),
  }),
});

export const { useGetPropertiesQuery, useAddPropertiesMutation } =
  PropertiesApi;
