'use client';

import FinanceSummary from './FinanceSummary/FinanceSummary';
import TransactionList from './TransactionList/TransactionList';

const Finance: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-foreground text-2xl font-bold tracking-tight'>
          Financial Tracking
        </h1>
        <p className='text-muted-foreground text-sm'>
          Income, expenses and tax preparation
        </p>
      </div>

      <FinanceSummary />

      <TransactionList />
    </div>
  );
};

export default Finance;
