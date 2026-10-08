'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ALERT_SEVERITY_STYLES,
  getAlertSeverity,
} from '@/data/client/Common/Dashboard/DashboardData';
import { useGetAlertsAndRemindersQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import { getComplianceDetailsUrl } from '@/utils/redirectPath';
import { Bell, BellOff, ChevronRight, RefreshCw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AlertsRemindersSkeleton from './AlertsRemindersSkeleton';

const AlertsReminders: React.FC = () => {
  const { data: session } = useSession();
  const {
    data: alertsData,
    isLoading,
    isError,
  } = useGetAlertsAndRemindersQuery();

  if (isLoading) {
    return <AlertsRemindersSkeleton />;
  }

  if (isError || !alertsData) {
    return <CustomErrorMessage title='alerts & reminders' />;
  }

  return (
    <Card className='border-border flex h-full flex-col rounded-2xl shadow-md'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Bell className='size-4 text-amber-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Alerts &amp; Reminders
          </CardTitle>
        </div>
      </CardHeader>
      {alertsData.length === 0 ? (
        <CardContent className='flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center'>
          <BellOff className='size-8 text-gray-300 dark:text-gray-600' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            No alerts or reminders
          </p>
        </CardContent>
      ) : (
        <CardContent className='max-h-105 space-y-2 overflow-y-auto px-4 pb-4'>
          {alertsData.map((alert, idx) => {
            const {
              icon: Icon,
              iconBg,
              iconColor,
              titleColor,
              badgeVariant,
            } = ALERT_SEVERITY_STYLES[getAlertSeverity(alert.days)];
            const content = (
              <>
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
                >
                  <Icon className={`size-4 ${iconColor}`} />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-foreground text-sm font-semibold'>
                    {alert.title}
                  </p>
                  <p className='text-muted-foreground mt-0.5 text-xs'>
                    <span className='wrap-break-word'>{alert.property}</span>
                    {' · '}
                    <span className={`font-medium ${titleColor}`}>
                      {alert.detail}
                    </span>
                  </p>
                </div>
                <Badge variant={badgeVariant} className='gap-1'>
                  <RefreshCw />
                  Renew
                </Badge>
              </>
            );
            const key = `${alert.title}-${alert.property}-${idx}`;
            const rowClass =
              'border-border flex items-center gap-3 rounded-xl border p-3 shadow-sm';

            return alert.alias ? (
              <Link
                key={key}
                href={getComplianceDetailsUrl(session, alert.alias)}
                className={`${rowClass} group hover:bg-muted/50 transition-colors`}
              >
                {content}
                <ChevronRight className='text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5' />
              </Link>
            ) : (
              <div key={key} className={rowClass}>
                {content}
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
};

export default AlertsReminders;
