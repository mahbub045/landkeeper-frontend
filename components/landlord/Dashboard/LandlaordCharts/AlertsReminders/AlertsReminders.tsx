'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { alerts } from '@/data/landlord/dashboard/DashboardData';
import { Bell } from 'lucide-react';

export default function AlertsReminders() {
  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Bell className='size-4 text-amber-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Alerts &amp; Reminders
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-4 pb-4 space-y-0'>
        {alerts.map((alert, idx) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 py-3 ${
                idx < alerts.length - 1
                  ? 'border-b border-gray-100 dark:border-gray-700/50'
                  : ''
              }`}
            >
              <div className={`p-2 rounded-full ${alert.iconBg} shrink-0`}>
                <Icon className={`size-4 ${alert.iconColor}`} />
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                  {alert.title}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                  {alert.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}