'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MonthlyChart from './MonthlyChart/MonthlyChart';
import RecentTransactions from './RecentTransactions/RecentTransactions';
import StatCards from './StatCards/StatCards';

const FinanceContainer: React.FC = () => {
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
        <Button>
          <Plus />
          Add Transaction
        </Button>
      </div>

      <StatCards />

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <MonthlyChart />
        <RecentTransactions />
      </div>
    </div>
  );
};

export default FinanceContainer;
