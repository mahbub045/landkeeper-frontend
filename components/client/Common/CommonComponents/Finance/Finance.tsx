'use client';


import CategoryChart from './Charts/CategoryChart';
import MonthlyChart from './Charts/MonthlyChart';
import StatCards from './StatCards/StatCards';
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

      <StatCards />

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]'>
        <MonthlyChart />
        <CategoryChart />
      </div>

      <TransactionList />
    </div>
  );
};

export default Finance;
