'use client';

import { useGetDashboardSummaryQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import { Building2, CheckCircle2, Wrench, XCircle } from 'lucide-react';

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

const PropertySummary: React.FC = () => {
  const { data: dashboardSummary, isLoading } = useGetDashboardSummaryQuery();

  const properties = dashboardSummary?.properties;

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='h-31 min-w-0 animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <StatCard
        iconBg='bg-blue-100 dark:bg-blue-900/30'
        icon={
          <Building2 className='size-5 text-blue-600 dark:text-blue-400' />
        }
        value={properties?.total ?? 0}
        label='Total Properties'
      />
      <StatCard
        iconBg='bg-emerald-100 dark:bg-emerald-900/30'
        icon={
          <CheckCircle2 className='size-5 text-emerald-600 dark:text-emerald-400' />
        }
        value={properties?.occupied ?? 0}
        label='Occupied'
      />
      <StatCard
        iconBg='bg-orange-100 dark:bg-orange-900/30'
        icon={
          <XCircle className='size-5 text-orange-600 dark:text-orange-400' />
        }
        value={properties?.vacant ?? 0}
        label='Vacant'
      />
      <StatCard
        iconBg='bg-red-100 dark:bg-red-900/30'
        icon={<Wrench className='size-5 text-red-500 dark:text-red-400' />}
        value={properties?.under_maintenance ?? 0}
        label='Under Maintenance'
      />
    </div>
  );
};

export default PropertySummary;
