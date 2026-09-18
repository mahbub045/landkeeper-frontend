'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useGetDashboardSummaryQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import { getCurrencySign } from '@/utils/formatters';
import {
  Anchor,
  ArrowLeftRight,
  Building2,
  Gauge,
  LineChart,
  TrendingDown,
} from 'lucide-react';

const SummaryCards: React.FC = () => {
  const { data: dashboardSummary } = useGetDashboardSummaryQuery();

  const mortgages = dashboardSummary?.mortgages;

  const stats = [
    {
      label: 'Total Mortgages',
      value: String(mortgages?.total ?? 0),
      icon: Building2,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Outstanding',
      value: `${getCurrencySign()}${parseFloat(
        mortgages?.total_outstanding ?? '0',
      ).toLocaleString('en-GB')}`,
      icon: TrendingDown,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-500 dark:text-red-400',
    },
    {
      label: 'Fixed Rate',
      value: String(mortgages?.fixed_rate ?? 0),
      icon: Anchor,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Variable Rate',
      value: String(mortgages?.variable_rate ?? 0),
      icon: LineChart,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Tracker',
      value: String(mortgages?.tracker ?? 0),
      icon: Gauge,
      iconBg: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
    {
      label: 'Offset',
      value: String(mortgages?.offset ?? 0),
      icon: ArrowLeftRight,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {stats.map((stat) => (
        <Card key={stat.label} className='border-border rounded-2xl shadow-md'>
          <CardContent className='px-6 py-3'>
            <div className='flex items-center justify-between'>
              <div
                className={`mb-4 flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <stat.icon className={`size-4 ${stat.iconColor}`} />
              </div>
              <p className='text-foreground text-2xl font-bold'>{stat.value}</p>
            </div>

            <p className='text-muted-foreground mt-1 text-sm'>{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
