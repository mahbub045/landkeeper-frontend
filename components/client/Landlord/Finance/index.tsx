'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddTransactionDialog from './Dialogs/AddTransactionDialog';
import MonthlyChart from './MonthlyChart/MonthlyChart';
import RecentTransactions from './RecentTransactions/RecentTransactions';
import StatCards from './StatCards/StatCards';

const FinanceContainer: React.FC = () => {
  const [addTransactionOpen, setAddTransactionOpen] = useState(false); // ← new

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Financial Tracking
          </h1>
          <p className='text-muted-foreground text-sm'>
            Income, expenses and tax preparation
          </p>
        </div>
        <Button onClick={() => setAddTransactionOpen(true)}>
          <Plus />
          Add Transaction
        </Button>
      </div>

      <StatCards />

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <MonthlyChart />
        <RecentTransactions />
      </div>

      {/* Add Transaction modal */}
      <AddTransactionDialog
        open={addTransactionOpen}
        onClose={() => setAddTransactionOpen(false)}
        onSuccess={() => {
          // refetch / revalidate transactions, stat cards, chart, etc. here
        }}
      />
    </div>
  );
};

export default FinanceContainer;
