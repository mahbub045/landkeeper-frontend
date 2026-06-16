'use client';

import { usageStats } from '@/data/landlord/settings/SettingsData';



export default function SubscriptionSettings() {
  return (
    <div className='bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm space-y-6'>
      <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Subscription</h2>

      {/* Plan banner */}
      <div className='flex items-center justify-between bg-gray-900 dark:bg-gray-950 rounded-2xl px-6 py-5'>
        <div>
          <p className='text-lg font-bold text-white'>Premium Plan</p>
          <p className='text-sm text-gray-300 mt-0.5'>£24.99/month · Unlimited properties</p>
          <p className='text-xs text-gray-400 mt-1'>Next billing: 15 June 2026</p>
        </div>
        <button className='bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors'>
          Manage Plan
        </button>
      </div>

      {/* Usage */}
      <div className='space-y-4'>
        <p className='text-sm font-semibold text-gray-900 dark:text-white'>Usage</p>
        {usageStats.map((stat) => (
          <div key={stat.label} className='space-y-1.5'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>{stat.label}</span>
              <span className='text-sm font-semibold text-gray-900 dark:text-white'>{stat.value}</span>
            </div>
            <div className='h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden'>
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
}