'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usageStats } from '@/data/landlord/tools/settings/SettingsData';
import { getCurrencySign } from '@/utils/formatters';

const SubscriptionSettings: React.FC = () => {
  return (
    <Card className='pt-0'>
      <CardContent className='space-y-6 p-6'>
        <h2 className='text-foreground text-sm font-semibold'>Subscription</h2>

        {/* Plan banner */}
        <div className='border-border flex items-center justify-between rounded-2xl border bg-white px-6 py-5 dark:border-0 dark:bg-gray-900'>
          <div>
            <p className='text-foreground text-lg font-bold dark:text-white'>
              Premium Plan
            </p>
            <p className='text-muted-foreground mt-0.5 text-sm dark:text-gray-300'>
              {getCurrencySign()}24.99/month · Unlimited properties
            </p>
            <p className='text-muted-foreground/70 mt-1 text-xs dark:text-gray-400'>
              Next billing: 15 June 2026
            </p>
          </div>
          <Button variant='secondary' className='rounded-xl'>
            Manage Plan
          </Button>
        </div>

        {/* Usage */}
        <div className='space-y-4'>
          <p className='text-foreground text-sm font-semibold'>Usage</p>
          {usageStats.map((stat) => (
            <div key={stat.label} className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-sm'>
                  {stat.label}
                </span>
                <span className='text-foreground text-sm font-semibold'>
                  {stat.value}
                </span>
              </div>
              <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
                <div
                  className='bg-primary h-full rounded-full'
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;
