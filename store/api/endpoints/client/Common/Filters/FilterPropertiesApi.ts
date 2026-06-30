import { baseApi } from '@/store/api/baseApi';

export const FilterPropertiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    filterProperties: builder.query({
      query: (params) => ({
        url: '/filters/properties',
        method: 'GET',
        params,
      }),
      providesTags: ['Property'],
    }),
  }),
});

export const { useFilterPropertiesQuery } = FilterPropertiesApi;
