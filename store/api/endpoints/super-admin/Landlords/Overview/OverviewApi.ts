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
    getlandlordDetails: builder.query<LandlordType, { landlord_uid: string }>({
      query: ({ landlord_uid }) => ({
        url: `/admin/landloards/${landlord_uid}`,
        method: 'GET',
      }),
      providesTags: ['Landlords'],
    }),
    editLandlord: builder.mutation<
      LandlordType,
      { landlord_uid: string; data: Partial<LandlordType> }
    >({
      query: ({ landlord_uid, data }) => ({
        url: `/admin/landloards/${landlord_uid}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Landlords'],
    }),
    deleteLandlord: builder.mutation<void, { landlord_uid: string }>({
      query: ({ landlord_uid }) => ({
        url: `/admin/landloards/${landlord_uid}`,
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
