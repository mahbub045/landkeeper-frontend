'use client';

import { dummyPaymentMethods } from '@/data/client/Tenant/RentAndPaymentDashboardData/RentAndPaymentDashboardData';
import { storeDirectDebitSessionToken } from '@/lib/storedirectdebitsessiontoken';
import {
  useGetPaymentMethodsQuery,
  useGetRentBalanceSummaryQuery,
  useSetupDirectDebitMutation,
} from '@/store/api/endpoints/client/Tenant/PaymentsApi/PaymentsApi';

import {
  ApiPaymentMethod,
  PaymentMethodOption,
} from '@/types/client/Tenant/RentAndPayments/RentAndPaymentsType';
import { useState } from 'react';
import { BalanceSummaryCard } from '../BalanceSummaryCard/BalanceSummaryCard';
import { PayWithCardDialog } from '../Dialogs/PayWithCardDialog';
import { PayWithDirectDebitDialog } from '../Dialogs/PayWithDirectDebitDialog';
import { PaymentHistoryTable } from '../PaymentHistoryTable/PaymentHistoryTable';
import { QuickPaymentCard } from '../QuickPaymentCard/QuickPaymentCard';
import { StatementsCard } from '../StatementsCard/StatementsCard';

const DIRECT_DEBIT_CALLBACK_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/client/tenant/rent-and-payments/direct-debit/callback`
    : '';

export const RentAndPaymentDashboard: React.FC = () => {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [isDirectDebitDialogOpen, setIsDirectDebitDialogOpen] = useState(false);

  const { data: balanceSummary } = useGetRentBalanceSummaryQuery(undefined);
  const { data: savedPaymentMethods } = useGetPaymentMethodsQuery({});

  const activeDirectDebit = savedPaymentMethods?.find(
    (method: ApiPaymentMethod) =>
      method.provider === 'GOCARDLESS' &&
      method.method_type === 'DIRECT_DEBIT' &&
      method.status === 'ACTIVE',
  );

  const paymentMethods: PaymentMethodOption[] = dummyPaymentMethods.map(
    (method) => {
      if (method.provider !== 'gocardless' || !activeDirectDebit) {
        return method;
      }

      return {
        ...method,
        title: 'Direct Debit active',
        description:
          "Request your bank to deduct this month's rent automatically.",
        ctaLabel: 'Request Rent Deduction',
        action: 'request-deduction',
      };
    },
  );

  const [setupDirectDebit, { isLoading: isSettingUpDirectDebit }] =
    useSetupDirectDebitMutation();

  const handleSelectPaymentMethod = async (method: PaymentMethodOption) => {
    if (method.provider === 'gocardless') {
      if (activeDirectDebit) {
        setIsDirectDebitDialogOpen(true);
        return;
      }

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

    if (method.provider === 'stripe') {
      setIsCardDialogOpen(true);
      return;
    }
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

      <BalanceSummaryCard summary={balanceSummary} />

      <QuickPaymentCard
        paymentMethods={paymentMethods}
        onSelectPaymentMethod={handleSelectPaymentMethod}
        loadingMethodId={isSettingUpDirectDebit ? 'gocardless' : null}
      />

      <StatementsCard />

      <PaymentHistoryTable />

      <PayWithCardDialog
        open={isCardDialogOpen}
        onOpenChange={setIsCardDialogOpen}
        onSuccess={() => {}}
      />

      <PayWithDirectDebitDialog
        open={isDirectDebitDialogOpen}
        onOpenChange={setIsDirectDebitDialogOpen}
        onSuccess={() => {}}
      />
    </div>
  );
};
