import { baseApi } from '@/store/api/baseApi';

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
    createRentPayment: builder.mutation({
      query: (body) => ({
        url: '/tenant/card-payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RentPayments'],
    }),

    getRentBalanceSummary: builder.query({
      query: () => ({
        url: '/tenant/rent-payments/balance-summary',
      }),
      providesTags: ['RentPayments'],
    }),

    getPaymentHistory: builder.query({
      query: (params) => ({
        url: '/tenant/payment-history',
        params,
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
  useCreateRentPaymentMutation,
  useGetRentBalanceSummaryQuery,
  useGetPaymentHistoryQuery,
  useGetPaymentMethodsQuery,
  useGetRentStatementPdfQuery,
} = paymentMethodsApi;
