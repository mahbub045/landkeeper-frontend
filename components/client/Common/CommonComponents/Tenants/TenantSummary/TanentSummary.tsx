'use client';

import { useGetDashboardSummaryQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import { Users, UserCheck, UserX } from 'lucide-react';

function StatCard({
  icon,
  iconBg,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
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

const TanentSummary: React.FC = () => {
  const { data: dashboardSummary, isLoading } = useGetDashboardSummaryQuery();

  const tenants = dashboardSummary?.tenants;

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, index) => (
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
        iconBg='bg-blue-100 dark:bg-blue-900/30'
        icon={<Users className='size-5 text-blue-600 dark:text-blue-400' />}
        value={tenants?.total ?? 0}
        label='Total Tenants'
      />
      <StatCard
        iconBg='bg-emerald-100 dark:bg-emerald-900/30'
        icon={
          <UserCheck className='size-5 text-emerald-600 dark:text-emerald-400' />
        }
        value={tenants?.active ?? 0}
        label='Active Tenants'
      />
      <StatCard
        iconBg='bg-red-100 dark:bg-red-900/30'
        icon={<UserX className='size-5 text-red-500 dark:text-red-400' />}
        value={tenants?.inactive ?? 0}
        label='Inactive Tenants'
      />
    </div>
  );
};

export default TanentSummary;
