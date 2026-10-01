import { baseApi } from '@/store/api/baseApi';
import {
  LandlordListParams,
  LandlordListResponse,
  LandlordType,
} from '@/types/super-admin/Landlords/LandlordOverview/LandlordOverviewType';

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
  }),
});

export const { useGetLandlordsQuery, useGetlandlordDetailsQuery } =
  LandlordOverviewApi;
