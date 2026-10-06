import { baseApi } from '@/store/api/baseApi';
import {
  MarketplaceApiCategory,
  MarketplaceCategoryPayload,
  MarketplaceProvider,
  MarketplaceProviderPayload,
  MarketplaceProvidersParams,
  MarketplaceProvidersResponse,
  UpdateMarketplaceCategoryArgs,
  UpdateMarketplaceProviderArgs,
} from '@/types/super-admin/Marketplace/MarketplaceTypes';

export const MarketplaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarketplaceCategories: builder.query<MarketplaceApiCategory[], void>({
      query: () => ({
        url: '/marketplace/categories',
        method: 'GET',
      }),
      providesTags: ['Marketplace'],
    }),
    createMarketplaceCategory: builder.mutation<
      MarketplaceApiCategory,
      MarketplaceCategoryPayload
    >({
      query: (payload) => ({
        url: '/marketplace/categories',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Marketplace'],
    }),
    updateMarketplaceCategory: builder.mutation<
      MarketplaceApiCategory,
      UpdateMarketplaceCategoryArgs
    >({
      query: ({ alias, payload }) => ({
        url: `/marketplace/categories/${alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Marketplace'],
    }),
    deleteMarketplaceCategory: builder.mutation<void, { alias: string }>({
      query: ({ alias }) => ({
        url: `/marketplace/categories/${alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Marketplace'],
    }),
    getMarketplaceProviders: builder.query<
      MarketplaceProvidersResponse,
      MarketplaceProvidersParams
    >({
      query: (params) => ({
        url: '/marketplace/providers',
        method: 'GET',
        params,
      }),
      providesTags: ['Marketplace'],
    }),
    createMarketplaceProvider: builder.mutation<
      MarketplaceProvider,
      MarketplaceProviderPayload | FormData
    >({
      query: (payload) => ({
        url: '/marketplace/providers',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Marketplace'],
    }),
    updateMarketplaceProvider: builder.mutation<
      MarketplaceProvider,
      UpdateMarketplaceProviderArgs
    >({
      query: ({ alias, payload }) => ({
        url: `/marketplace/providers/${alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Marketplace'],
    }),
    deleteMarketplaceProvider: builder.mutation<void, { alias: string }>({
      query: ({ alias }) => ({
        url: `/marketplace/providers/${alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Marketplace'],
    }),
  }),
});

export const {
  useGetMarketplaceCategoriesQuery,
  useCreateMarketplaceCategoryMutation,
  useUpdateMarketplaceCategoryMutation,
  useDeleteMarketplaceCategoryMutation,
  useGetMarketplaceProvidersQuery,
  useCreateMarketplaceProviderMutation,
  useUpdateMarketplaceProviderMutation,
  useDeleteMarketplaceProviderMutation,
} = MarketplaceApi;
