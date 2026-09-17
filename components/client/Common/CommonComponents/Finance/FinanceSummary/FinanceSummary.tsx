'use client';

import { useGetDashboardSummaryQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import { formatCurrency } from '@/utils/formatters';
import {
  Calculator,
  Home,
  Landmark,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

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
    <div className='min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50'>
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

const FinanceSummary: React.FC = () => {
  const { data: dashboardSummary, isLoading } = useGetDashboardSummaryQuery();

  const financial = dashboardSummary?.financial;

  const toAmount = (value: string | undefined) =>
    formatCurrency(value != null ? Number(value) : null) || `£0.00`;

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='h-31 min-w-0 animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      <StatCard
        iconBg='bg-emerald-100 dark:bg-emerald-900/30'
        icon={
          <Home className='size-5 text-emerald-600 dark:text-emerald-400' />
        }
        value={toAmount(financial?.monthly_rental_income)}
        label='Monthly Rental Income'
      />
      <StatCard
        iconBg='bg-red-100 dark:bg-red-900/30'
        icon={<Landmark className='size-5 text-red-500 dark:text-red-400' />}
        value={toAmount(financial?.mortgage_outstanding)}
        label='Mortgage Outstanding'
      />
      <StatCard
        iconBg='bg-orange-100 dark:bg-orange-900/30'
        icon={
          <Wallet className='size-5 text-orange-600 dark:text-orange-400' />
        }
        value={toAmount(financial?.monthly_mortgage_payment)}
        label='Monthly Mortgage Payment'
      />
      <StatCard
        iconBg='bg-blue-100 dark:bg-blue-900/30'
        icon={
          <TrendingUp className='size-5 text-blue-600 dark:text-blue-400' />
        }
        value={toAmount(financial?.current_month_income)}
        label='Current Month Income'
      />
      <StatCard
        iconBg='bg-rose-100 dark:bg-rose-900/30'
        icon={
          <TrendingDown className='size-5 text-rose-600 dark:text-rose-400' />
        }
        value={toAmount(financial?.current_month_expense)}
        label='Current Month Expense'
      />
      <StatCard
        iconBg='bg-purple-100 dark:bg-purple-900/30'
        icon={
          <Calculator className='size-5 text-purple-600 dark:text-purple-400' />
        }
        value={toAmount(financial?.current_month_net)}
        label='Current Month Net'
      />
    </div>
  );
};

export default FinanceSummary;
