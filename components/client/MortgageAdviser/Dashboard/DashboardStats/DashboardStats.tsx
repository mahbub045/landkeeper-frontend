'use client';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent } from '@/components/ui/card';
import { useGetDashboardSummaryQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import {
  DashboardData,
  StatCard,
} from '@/types/client/Common/Dashboard/DashboardTypes';
import { FileText, MapPin, PoundSterling } from 'lucide-react';
import DashboardStatsSkeleton from '../../../Common/CommonComponents/Dashboard/DashboardStats/DashboardStatsSkeleton';

const buildStats = (summary: DashboardData): StatCard[] => [
  {
    title: 'Total Properties',
    value: String(summary.properties.total),
    icon: MapPin,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Total Mortgages',
    value: String(summary.mortgages.total),
    icon: FileText,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
  },
  {
    title: 'Total Outstanding Balance',
    value: summary.mortgages.total_outstanding,
    icon: PoundSterling,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-500',
  },
];

const DashboardStats: React.FC = () => {
  const {
    data: dashboardSummary,
    isLoading,
    isError,
  } = useGetDashboardSummaryQuery();

  if (isLoading) {
    return <DashboardStatsSkeleton count={3} />;
  }

  if (isError || !dashboardSummary) {
    return <CustomErrorMessage title='dashboard stats' />;
  }

  const stats = buildStats(dashboardSummary);

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className='border-border rounded-2xl shadow-md'
          >
            <CardContent className='px-6 py-3'>
              <div className='flex items-center justify-between'>
                <div
                  className={`mb-4 flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className={`size-4 ${stat.iconColor}`} />
                </div>

                <p className='text-foreground text-2xl font-bold'>
                  {stat.value}
                </p>
              </div>

              <p className='text-foreground mt-1 text-sm font-medium'>
                {stat.title}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
