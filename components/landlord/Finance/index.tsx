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
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Financial Tracking
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
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
