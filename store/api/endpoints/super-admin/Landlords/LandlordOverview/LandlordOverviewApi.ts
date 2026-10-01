import { baseApi } from '@/store/api/baseApi';
import {
  LandlordListParams,
  LandlordListResponse,
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
  }),
});

export const { useGetLandlordsQuery } = LandlordOverviewApi;
