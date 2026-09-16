'use client';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useGetDashboardSummaryQuery } from '@/store/api/endpoints/client/Landlord/Dashboard/DashboardApi';
import {
  BadgeVariant,
  DashboardData,
  StatCard,
} from '@/types/client/Landlord/Dashboard/DashboardTypes';
import {
  Home,
  Landmark,
  Percent,
  PoundSterling,
  TriangleAlert,
  Users,
} from 'lucide-react';
import LandlordStatsSkeleton from './LandlordStatsSkeleton';
import { badgeStyles } from '@/data/client/Landlord/dashboard/DashboardData';



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

const LandlordStatsContainer: React.FC = () => {
  const {
    data: dashboardSummary,
    isLoading,
    isError,
  } = useGetDashboardSummaryQuery();

  if (isLoading) {
    return <LandlordStatsSkeleton />;
  }

  if (isError || !dashboardSummary) {
    return <CustomErrorMessage title='dashboard stats' />;
  }

  const stats = buildStats(dashboardSummary);

  return (
    <div className='grid grid-cols-2 gap-4 xl:grid-cols-3'>
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className='border-border rounded-2xl border shadow-sm'
          >
            <CardContent className='px-5 py-2'>
              <div className='mb-4 flex items-start justify-between'>
                <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>

                {stat.badge && (
                  <Badge
                    variant='outline'
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      badgeStyles[stat.badge.variant as BadgeVariant]
                    }`}
                  >
                    {stat.badge.label}
                  </Badge>
                )}
              </div>

              <p className='text-foreground mb-1 text-2xl font-bold'>
                {stat.value}
              </p>

              <p className='text-muted-foreground text-sm'>{stat.title}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LandlordStatsContainer;
