'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ALERT_SEVERITY_STYLES,
  getAlertSeverity,
} from '@/data/client/Common/Dashboard/DashboardData';
import { useGetAlertsAndRemindersQuery } from '@/store/api/endpoints/client/Common/Dashboard/DashboardApi';
import { Bell, BellOff } from 'lucide-react';
import AlertsRemindersSkeleton from './AlertsRemindersSkeleton';

const AlertsReminders: React.FC = () => {
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
    <Card className='flex h-full flex-col rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
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
        <CardContent className='max-h-[370px] space-y-0 overflow-y-auto px-4 pb-4'>
          {alertsData.map((alert, idx) => {
            const {
              icon: Icon,
              iconBg,
              iconColor,
              titleColor,
            } = ALERT_SEVERITY_STYLES[getAlertSeverity(alert.days)];
            return (
              <div
                key={`${alert.title}-${alert.property}-${idx}`}
                className={`flex items-start gap-3 py-3 ${
                  idx < alertsData.length - 1
                    ? 'border-b border-gray-100 dark:border-gray-700/50'
                    : ''
                }`}
              >
                <div className={`shrink-0 rounded-full p-2 ${iconBg}`}>
                  <Icon className={`size-4 ${iconColor}`} />
                </div>
                <div className='min-w-0'>
                  <p className={`text-sm font-semibold ${titleColor}`}>
                    {alert.title}
                  </p>
                  <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                    <span className='break-words'>{alert.property}</span>
                    {' · '}
                    {alert.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
};

export default AlertsReminders;
