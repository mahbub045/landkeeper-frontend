import { baseApi } from '@/store/api/baseApi';
import {
  LandlordListParams,
  LandlordListResponse,
  LandlordType,
} from '@/types/super-admin/Landlords/Overview/OverviewType';

export const LandlordOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLandlords: builder.query<LandlordListResponse, LandlordListParams>({
      query: (params) => ({
        url: '/admin/landloards',
        method: 'GET',
        params,
      }),
      providesTags: ['Landlords'],
    }),
    getlandlordDetails: builder.query<LandlordType, { landlord_alias: string }>(
      {
        query: ({ landlord_alias }) => ({
          url: `/admin/landloards/${landlord_alias}`,
          method: 'GET',
        }),
        providesTags: ['Landlords'],
      },
    ),
    editLandlord: builder.mutation<
      LandlordType,
      { landlord_alias: string; data: Partial<LandlordType> | FormData }
    >({
      query: ({ landlord_alias, data }) => ({
        url: `/admin/landloards/${landlord_alias}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Landlords'],
    }),
    deleteLandlord: builder.mutation<void, { landlord_alias: string }>({
      query: ({ landlord_alias }) => ({
        url: `/admin/landloards/${landlord_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Landlords'],
    }),
  }),
});

export const {
  useGetLandlordsQuery,
  useGetlandlordDetailsQuery,
  useEditLandlordMutation,
  useDeleteLandlordMutation,
} = LandlordOverviewApi;
