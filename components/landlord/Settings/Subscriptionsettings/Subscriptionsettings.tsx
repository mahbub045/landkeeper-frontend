'use client';

import { usageStats } from '@/data/landlord/settings/SettingsData';

const SubscriptionSettings: React.FC = () => {
  return (
    <div className='space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50'>
      <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>
        Subscription
      </h2>

      {/* Plan banner */}
      <div className='flex items-center justify-between rounded-2xl bg-gray-900 px-6 py-5 dark:bg-gray-950'>
        <div>
          <p className='text-lg font-bold text-white'>Premium Plan</p>
          <p className='mt-0.5 text-sm text-gray-300'>
            £24.99/month · Unlimited properties
          </p>
          <p className='mt-1 text-xs text-gray-400'>
            Next billing: 15 June 2026
          </p>
        </div>
        <button className='rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100'>
          Manage Plan
        </button>
      </div>

      {/* Usage */}
      <div className='space-y-4'>
        <p className='text-sm font-semibold text-gray-900 dark:text-white'>
          Usage
        </p>
        {usageStats.map((stat) => (
          <div key={stat.label} className='space-y-1.5'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {stat.label}
              </span>
              <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                {stat.value}
              </span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700'>
              <div
                className='h-full rounded-full bg-blue-600'
                style={{ width: `${stat.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionSettings;
