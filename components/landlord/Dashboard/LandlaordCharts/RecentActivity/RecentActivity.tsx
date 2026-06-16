'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activities } from '@/data/landlord/dashboard/DashboardData';
import { Activity } from 'lucide-react';

export default function RecentActivity() {
  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Activity className='size-4 text-teal-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-4 pb-4 space-y-0'>
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className='flex items-start gap-3 py-3 relative'>
              {/* Left accent bar */}
              <div
                className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${activity.accentColor}`}
              />
              <div className={`ml-3 p-2 rounded-full ${activity.iconBg} shrink-0`}>
                <Icon className={`size-4 ${activity.iconColor}`} />
              </div>
              <div className='flex-1 min-w-0'>
                <p className={`text-sm font-semibold ${activity.titleColor}`}>
                  {activity.title}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate'>
                  {activity.subtitle}
                </p>
              </div>
              <p className='text-xs text-gray-400 dark:text-gray-500 shrink-0'>
                {activity.time}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}