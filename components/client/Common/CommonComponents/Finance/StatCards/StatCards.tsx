'use client';

import { getCurrencySign } from '@/utils/formatters';
import { Calculator, Percent, TrendingDown, TrendingUp } from 'lucide-react';

function StatCard({
  icon,
  iconBg,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
}) {
  return (
    <div className='min-w-0 flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50'>
      <div
        className={`mb-4 flex size-11 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <p className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
        {value}
      </p>
      <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{label}</p>
    </div>
  );
}

const StatCards: React.FC = () => {
  return (
    <div className='flex flex-wrap gap-4'>
      <StatCard
        iconBg='bg-emerald-100 dark:bg-emerald-900/30'
        icon={
          <TrendingUp className='size-5 text-emerald-600 dark:text-emerald-400' />
        }
        // value='£51,000'
        value={`${getCurrencySign()}51,000`}
        label='YTD Income'
      />
      <StatCard
        iconBg='bg-red-100 dark:bg-red-900/30'
        icon={
          <TrendingDown className='size-5 text-red-500 dark:text-red-400' />
        }
        value={`${getCurrencySign()}18,450`}
        label='YTD Expenses'
      />
      <StatCard
        iconBg='bg-blue-100 dark:bg-blue-900/30'
        icon={
          <Calculator className='size-5 text-blue-600 dark:text-blue-400' />
        }
        value={`${getCurrencySign()}32,550`}
        label='Net Profit'
      />
      <StatCard
        iconBg='bg-purple-100 dark:bg-purple-900/30'
        icon={
          <Percent className='size-5 text-purple-600 dark:text-purple-400' />
        }
        value='63.8%'
        label='Profit Margin'
      />
    </div>
  );
};

export default StatCards;
