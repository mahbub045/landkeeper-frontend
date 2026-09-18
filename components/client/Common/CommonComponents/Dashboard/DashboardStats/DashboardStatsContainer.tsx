'use client';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent } from '@/components/ui/card';
import { useGetDashboardSummaryQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import {
  DashboardData,
  StatCard,
} from '@/types/client/Common/Dashboard/DashboardTypes';
import {
  Home,
  Landmark,
  Percent,
  PoundSterling,
  TriangleAlert,
  Users,
} from 'lucide-react';
import DashboardStatsSkeleton from './DashboardStatsSkeleton';

const buildStats = (summary: DashboardData): StatCard[] => {
  const profitMargin =
    Number(summary.financial.current_month_income) > 0
      ? (Number(summary.financial.current_month_net) /
          Number(summary.financial.current_month_income)) *
        100
      : 0;

  const complianceIssues =
    summary.compliance.expired + summary.compliance.expiring_soon;

  return [
    {
      title: 'Total Properties',
      value: String(summary.properties.total),
      icon: Home,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Monthly Rental Income',
      value: summary.financial.monthly_rental_income,
      icon: PoundSterling,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Monthly Mortgage Payments',
      value: summary.financial.monthly_mortgage_payment,
      icon: Landmark,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Compliance Issues',
      value: String(complianceIssues),
      icon: TriangleAlert,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-500',
      badge:
        complianceIssues > 0
          ? { label: `${complianceIssues} Alerts`, variant: 'alert' }
          : undefined,
    },
    {
      title: 'Profit Margin',
      value: `${profitMargin.toFixed(1)}%`,
      icon: Percent,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Occupancy Rate',
      value: `${summary.properties.occupied}/${summary.properties.total}`,
      icon: Users,
      iconBg: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-500',
    },
  ];
};

const DashboardStatsContainer: React.FC = () => {
  const {
    data: dashboardSummary,
    isLoading,
    isError,
  } = useGetDashboardSummaryQuery();

  if (isLoading) {
    return <DashboardStatsSkeleton />;
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

              <p className='text-muted-foreground mt-1 text-sm'>{stat.title}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStatsContainer;
