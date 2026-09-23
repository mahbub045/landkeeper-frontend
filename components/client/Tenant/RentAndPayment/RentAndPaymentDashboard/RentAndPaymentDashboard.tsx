'use client';

import { dummyPaymentMethods } from '@/data/client/Tenant/RentAndPaymentDashboardData/RentAndPaymentDashboardData';
import { useGetRentBalanceSummaryQuery } from '@/store/api/endpoints/client/Tenant/PaymentsApi/PaymentsApi';

import { PaymentMethodOption } from '@/types/client/Tenant/RentAndPayments/RentAndPaymentsType';
import { useState } from 'react';
import { BalanceSummaryCard } from '../BalanceSummaryCard/BalanceSummaryCard';
import { PayWithCardDialog } from '../Dialogs/PayWithCardDialog';
import { PaymentHistoryTable } from '../PaymentHistoryTable/PaymentHistoryTable';
import { QuickPaymentCard } from '../QuickPaymentCard/QuickPaymentCard';
import { StatementsCard } from '../StatementsCard/StatementsCard';

export const RentAndPaymentDashboard: React.FC = () => {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);

  const { data: balanceSummary } = useGetRentBalanceSummaryQuery(undefined);

  const paymentMethods: PaymentMethodOption[] = dummyPaymentMethods;

  const handleSelectPaymentMethod = async (method: PaymentMethodOption) => {
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

      <div className='grid gap-6 md:grid-cols-2'>
        <QuickPaymentCard
          paymentMethods={paymentMethods}
          onSelectPaymentMethod={handleSelectPaymentMethod}
        />

        <StatementsCard />
      </div>

      <PaymentHistoryTable />

      <PayWithCardDialog
        open={isCardDialogOpen}
        onOpenChange={setIsCardDialogOpen}
        onSuccess={() => {}}
      />
    </div>
  );
};
