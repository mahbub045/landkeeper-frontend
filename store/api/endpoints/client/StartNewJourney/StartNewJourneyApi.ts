import { baseApi } from '@/store/api/baseApi';

export const StartNewJourneyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewJourney: builder.mutation({
      query: (payload) => ({
        url: '/mortgage',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['NewJourney'],
    }),
  }),
});

export const { useAddNewJourneyMutation } = StartNewJourneyApi;
