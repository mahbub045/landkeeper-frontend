import { mapApiRentPaymentToPaymentRecord } from '@/data/client/Tenant/RentAndPaymentDashboardData/RentAndPaymentDashboardData';
import { baseApi } from '@/store/api/baseApi';
import {
  ApiRentBalanceSummary,
  ApiRentPayment,
  PaymentRecord,
} from '@/types/client/Tenant/TenantTypes';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const paymentMethodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setupDirectDebit: builder.mutation({
      query: (body) => ({
        url: '/tenant/payment-methods/direct-debit/setup',
        method: 'POST',
        body,
      }),
    }),

    completeDirectDebit: builder.mutation({
      query: (body) => ({
        url: '/tenant/payment-methods/direct-debit/complete',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PaymentMethods'],
    }),

    getRentBalanceSummary: builder.query<ApiRentBalanceSummary, void>({
      query: () => '/tenant/rent-payments/balance-summary',
    }),

    getRentPayments: builder.query<
      { results: PaymentRecord[]; count: number },
      { page: number }
    >({
      query: ({ page }) => `/tenant/rent-payments?page=${page}`,
      transformResponse: (response: {
        count: number;
        results: ApiRentPayment[];
      }) => ({
        count: response.count,
        results: response.results.map(mapApiRentPaymentToPaymentRecord),
      }),
      providesTags: ['RentPayments'],
    }),

    getPaymentMethods: builder.query({
      query: () => '/tenant/payment-methods',
      transformResponse: (response) => response.results,
      providesTags: ['PaymentMethods'],
    }),

    getRentStatementPdf: builder.query<
      { success: true },
      { filename: string; period?: 'monthly'; year?: number; month?: number }
    >({
      queryFn: async (
        { filename, ...params },
        _api,
        _extraOptions,
        baseQuery,
      ) => {
        const result = await baseQuery({
          url: '/tenant/rent-payments/rent-statement-pdf',
          params: Object.keys(params).length ? params : undefined,
          responseHandler: (response: Response) => response.blob(),
        });

        if (result.error) {
          return { error: result.error };
        }

        downloadBlob(result.data as Blob, filename);

        return { data: { success: true } };
      },
    }),
  }),
});

export const {
  useSetupDirectDebitMutation,
  useCompleteDirectDebitMutation,
  useGetRentBalanceSummaryQuery,
  useGetRentPaymentsQuery,
  useGetPaymentMethodsQuery,
  useGetRentStatementPdfQuery,
} = paymentMethodsApi;
