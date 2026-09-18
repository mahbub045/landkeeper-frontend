'use client';

import { Card, CardContent } from '@/components/ui/card';
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

const PropertySummary: React.FC = () => {
  const { data: dashboardSummary, isLoading } = useGetDashboardSummaryQuery();

  const properties = dashboardSummary?.properties;

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='border-border bg-card h-24 min-w-0 animate-pulse rounded-2xl border shadow-md'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
      <StatCard
        iconBg='bg-blue-100 dark:bg-blue-900/30'
        icon={
          <Building2 className='size-4 text-blue-600 dark:text-blue-400' />
        }
        value={properties?.total ?? 0}
        label='Total Properties'
      />
      <StatCard
        iconBg='bg-emerald-100 dark:bg-emerald-900/30'
        icon={
          <CheckCircle2 className='size-4 text-emerald-600 dark:text-emerald-400' />
        }
        value={properties?.occupied ?? 0}
        label='Occupied'
      />
      <StatCard
        iconBg='bg-orange-100 dark:bg-orange-900/30'
        icon={
          <XCircle className='size-4 text-orange-600 dark:text-orange-400' />
        }
        value={properties?.vacant ?? 0}
        label='Vacant'
      />
      <StatCard
        iconBg='bg-red-100 dark:bg-red-900/30'
        icon={<Wrench className='size-4 text-red-500 dark:text-red-400' />}
        value={properties?.under_maintenance ?? 0}
        label='Under Maintenance'
      />
    </div>
  );
};

export default PropertySummary;
