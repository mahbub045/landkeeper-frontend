'use client';

import { defaultNotifications } from '@/data/landlord/settings/SettingsData';
import { NotificationSetting } from '@/types/landlord/Settings/SettingsTypes';
import { useState } from 'react';
import { Toggle } from '../Settingscontrols/Settingscontrols';

const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] =
    useState<NotificationSetting[]>(defaultNotifications);

  function toggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  }

  return (
    <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50'>
      <h2 className='mb-5 text-sm font-semibold text-gray-900 dark:text-white'>
        Notifications
      </h2>
      <div className='divide-y divide-gray-50 dark:divide-gray-700/40'>
        {notifications.map((n) => (
          <div
            key={n.id}
            className='flex items-center justify-between py-4 first:pt-0 last:pb-0'
          >
            <div>
              <p className='text-sm font-bold text-gray-900 dark:text-white'>
                {n.title}
              </p>
              <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                {n.description}
              </p>
            </div>
            <Toggle
              enabled={n.enabled}
              onToggle={() => toggleNotification(n.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
