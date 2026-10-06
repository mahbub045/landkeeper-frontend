'use client';

import { Card, CardContent } from '@/components/ui/card';
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
    <Card className='border-border rounded-2xl shadow-md'>
      <CardContent className='px-6 py-3'>
        <div className='flex items-center justify-between'>
          <div
            className={`mb-4 flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}
          >
            {icon}
          </div>
          <p className='text-foreground text-2xl font-bold'>{value}</p>
        </div>

        <p className='text-muted-foreground mt-1 text-sm'>{label}</p>
      </CardContent>
    </Card>
  );
}

const TanentSummary: React.FC = () => {
  const { data: dashboardSummary, isLoading } = useGetDashboardSummaryQuery();

  const tenants = dashboardSummary?.tenants;

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className='border-border bg-card h-24 min-w-0 animate-pulse rounded-2xl border shadow-md'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      <StatCard
        iconBg='bg-blue-100 dark:bg-blue-900/30'
        icon={<Users className='size-4 text-blue-600 dark:text-blue-400' />}
        value={tenants?.total ?? 0}
        label='Total Tenants'
      />
      <StatCard
        iconBg='bg-emerald-100 dark:bg-emerald-900/30'
        icon={
          <UserCheck className='size-4 text-emerald-600 dark:text-emerald-400' />
        }
        value={tenants?.active ?? 0}
        label='Active Tenants'
      />
      <StatCard
        iconBg='bg-red-100 dark:bg-red-900/30'
        icon={<UserX className='size-4 text-red-500 dark:text-red-400' />}
        value={tenants?.inactive ?? 0}
        label='Inactive Tenants'
      />
    </div>
  );
};

export default TanentSummary;
