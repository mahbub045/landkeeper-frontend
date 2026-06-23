import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';
import type { AuthRootState } from '../types';

export const TAG_TYPES = [
  'UserProfileAndSettings',
  'CompanyInfo',
  'FormLayout',
  'Network',
  'Organisation',
] as const;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers, { getState }) => {
      const session = await getSession();
      const token =
        session?.user?.accessToken ||
        (getState() as AuthRootState).auth.accessToken;
        
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});
