'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { defaultNotifications } from '@/data/landlord/settings/SettingsData';
import { NotificationSetting } from '@/types/landlord/Settings/SettingsTypes';
import { useState } from 'react';

const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] =
    useState<NotificationSetting[]>(defaultNotifications);

  return (
    <Card className='pt-0'>
      <CardContent className='p-6'>
        <h2 className='mb-5 text-sm font-semibold text-foreground'>
          Notifications
        </h2>
        <div className='divide-y divide-border'>
          {notifications.map((n) => (
            <div
              key={n.id}
              className='flex items-center justify-between py-4 first:pt-0 last:pb-0'
            >
              <div>
                <p className='text-sm font-bold text-foreground'>{n.title}</p>
                <p className='mt-0.5 text-xs text-muted-foreground'>{n.description}</p>
              </div>
              <Switch
                checked={n.enabled}
                onCheckedChange={() =>
                  setNotifications((prev) =>
                    prev.map((item) =>
                      item.id === n.id ? { ...item, enabled: !item.enabled } : item,
                    ),
                  )
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;