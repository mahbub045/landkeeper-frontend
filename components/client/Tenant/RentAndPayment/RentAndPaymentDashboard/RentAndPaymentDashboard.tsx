'use client';

import {
  dummyPaymentHistory,
  dummyPaymentMethods,
  dummyRentSummary,
} from '@/data/client/Tenant/RentAndPaymentDashboardData/RentAndPaymentDashboardData';
import { storeDirectDebitSessionToken } from '@/lib/storedirectdebitsessiontoken';
import {
  useGetPaymentMethodsQuery,
  useSetupDirectDebitMutation,
} from '@/store/api/endpoints/client/Tenant/PaymentsApi/PaymentsApi';
import {
  ApiPaymentMethod,
  PaymentMethodOption,
  PaymentRecord,
} from '@/types/client/Tenant/TenantTypes';
import { BalanceSummaryCard } from '../BalanceSummaryCard/BalanceSummaryCard';
import { QuickPaymentCard } from '../QuickPaymentCard/QuickPaymentCard';
import { StatementsCard } from '../StatementsCard/StatementsCard';

const DIRECT_DEBIT_CALLBACK_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/client/tenant/rent-and-payments/direct-debit/callback`
    : '';

export const RentAndPaymentDashboard: React.FC = () => {
  // TODO: swap these for RTK Query hooks once the remaining endpoints are confirmed, e.g.
  // const { data: summary, isLoading } = useGetRentSummaryQuery();
  // const { data: paymentHistory } = useGetPaymentHistoryQuery();
  const summary = dummyRentSummary;
  const paymentHistory = dummyPaymentHistory;

  const { data: savedPaymentMethods } = useGetPaymentMethodsQuery({});

  const FORCE_SETUP_FOR_TESTING = true;

  const activeDirectDebit = FORCE_SETUP_FOR_TESTING
    ? undefined
    : savedPaymentMethods?.find(
        (method: ApiPaymentMethod) =>
          method.provider === 'GOCARDLESS' &&
          method.method_type === 'DIRECT_DEBIT' &&
          method.status === 'ACTIVE',
      );

  //   const activeDirectDebit = savedPaymentMethods?.find(
  //     (method: ApiPaymentMethod) =>
  //       method.provider === 'GOCARDLESS' &&
  //       method.method_type === 'DIRECT_DEBIT' &&
  //       method.status === 'ACTIVE',
  //   );

  // Start from the dummy/base options, then override the GoCardless entry
  // once we know a mandate already exists. Stripe stays as-is until that
  // endpoint is wired up.
  const paymentMethods: PaymentMethodOption[] = dummyPaymentMethods.map(
    (method) => {
      if (method.provider !== 'gocardless' || !activeDirectDebit) {
        return method;
      }

      return {
        ...method,
        title: 'Direct Debit active',
        description:
          'Rent is collected automatically from your bank account each month.',
        ctaLabel: 'Manage Direct Debit',
        action: 'manage',
      };
    },
  );

  const [setupDirectDebit, { isLoading: isSettingUpDirectDebit }] =
    useSetupDirectDebitMutation();

  const handleSelectPaymentMethod = async (method: PaymentMethodOption) => {
    if (method.provider === 'gocardless') {
      try {
        const result = await setupDirectDebit({
          success_redirect_url: DIRECT_DEBIT_CALLBACK_URL,
        }).unwrap();

        storeDirectDebitSessionToken(result.session_token);
        window.location.href = result.redirect_url;
      } catch (error) {
        console.error('Failed to start Direct Debit setup:', error);
      }
      return;
    }

    console.log('Selected payment method:', method.provider);
  };

  const handleDownloadFullYearStatement = () => {
    // TODO: call full-year statement endpoint, then trigger file download
    console.log('Download full year statement');
  };

  const handleSelectCustomRange = () => {
    // TODO: open a date range picker dialog, then call the custom-range endpoint
    console.log('Open custom range picker');
  };

  const handleDownloadReceipt = (payment: PaymentRecord) => {
    // TODO: fetch/download the receipt for this specific payment
    console.log('Download receipt for', payment.reference);
  };

  return (
    <div className='mx-auto flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-semibold'>Rent & Payments Dashboard</h1>
        <p className='text-muted-foreground text-sm'>
          Manage your rent payments, view statements, and track your payment
          history.
        </p>
      </div>

      <QuickPaymentCard
        paymentMethods={paymentMethods}
        onSelectPaymentMethod={handleSelectPaymentMethod}
        loadingMethodId={isSettingUpDirectDebit ? 'gocardless' : null}
      />

      <BalanceSummaryCard summary={summary} />

      <StatementsCard
        onDownloadFullYear={handleDownloadFullYearStatement}
        onSelectCustomRange={handleSelectCustomRange}
      />

      {/* <PaymentHistoryTable
        payments={paymentHistory}
        onDownloadReceipt={handleDownloadReceipt}
      /> */}
    </div>
  );
};
