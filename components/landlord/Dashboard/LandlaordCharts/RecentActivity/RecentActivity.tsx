'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activities } from '@/data/landlord/dashboard/DashboardData';
import { Activity } from 'lucide-react';

const RecentActivity: React.FC = () => {
  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Activity className='size-4 text-teal-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-0 px-4 pb-4'>
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className='relative flex items-start gap-3 py-3'
            >
              {/* Left accent bar */}
              <div
                className={`absolute top-3 bottom-3 left-0 w-0.5 rounded-full ${activity.accentColor}`}
              />
              <div
                className={`ml-3 rounded-full p-2 ${activity.iconBg} shrink-0`}
              >
                <Icon className={`size-4 ${activity.iconColor}`} />
              </div>
              <div className='min-w-0 flex-1'>
                <p className={`text-sm font-semibold ${activity.titleColor}`}>
                  {activity.title}
                </p>
                <p className='mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400'>
                  {activity.subtitle}
                </p>
              </div>
              <p className='shrink-0 text-xs text-gray-400 dark:text-gray-500'>
                {activity.time}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
