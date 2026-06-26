import { baseApi } from '@/store/api/baseApi';

export const PropertiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params) => ({ 
        url: '/property', 
        method: 'GET', 
        params 
      }),
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
    getPropertyDetails: builder.query({
      query: (alias) => ({ 
        url: `/property/${alias}`, 
        method: 'GET' 
      }),
      providesTags: ['Property'],
    }),
    updateProperty: builder.mutation({
      query: ({ property_alias, payload }) => ({
        url: `/property/${property_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Property'],
    }),
    deleteProperty: builder.mutation({
      query: ({ property_alias }) => ({
        url: `/property/${property_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Property'],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useAddPropertiesMutation,
  useGetPropertyDetailsQuery,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = PropertiesApi;
