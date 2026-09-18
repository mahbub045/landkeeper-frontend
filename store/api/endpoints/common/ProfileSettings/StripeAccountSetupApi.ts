import { baseApi } from '@/store/api/baseApi';

interface StripeConnectStatusResponse {
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

interface StripeAccountSetupLinkResponse {
  authorize_url: string;
}

interface StripeOAuthCallbackParams {
  scope: string;
  code: string;
  state: string;
}

export const StripeAccountSetupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStripeConnectStatus: builder.query<StripeConnectStatusResponse, void>({
      query: () => ({
        url: '/organisation/stripe-connect-status',
        method: 'GET',
      }),
    }),
    getStripeAccountSetupLink: builder.query<
      StripeAccountSetupLinkResponse,
      void
    >({
      query: () => ({
        url: '/organisation/stripe-oauth-start',
        method: 'GET',
      }),
    }),
    setStripeOAuthCode: builder.query<void, StripeOAuthCallbackParams>({
      query: (params) => ({
        url: '/organisation/stripe-oauth-callback',
        method: 'GET',
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStripeConnectStatusQuery,
  useGetStripeAccountSetupLinkQuery,
  useLazyGetStripeAccountSetupLinkQuery,
  useSetStripeOAuthCodeQuery,
  useLazySetStripeOAuthCodeQuery,
} = StripeAccountSetupApi;
