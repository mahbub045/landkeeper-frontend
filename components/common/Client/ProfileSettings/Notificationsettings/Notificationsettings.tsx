'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { defaultNotifications } from '@/data/landlord/tools/settings/SettingsData';
import { NotificationSetting } from '@/types/landlord/Tools/Settings/SettingsTypes';
import { useState } from 'react';

const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] =
    useState<NotificationSetting[]>(defaultNotifications);

  return (
    <Card className='pt-0'>
      <CardContent className='p-6'>
        <h2 className='text-foreground mb-5 text-sm font-semibold'>
          Notifications
        </h2>
        <div className='divide-border divide-y'>
          {notifications.map((n) => (
            <div
              key={n.id}
              className='flex items-center justify-between py-4 first:pt-0 last:pb-0'
            >
              <div>
                <p className='text-foreground text-sm font-bold'>{n.title}</p>
                <p className='text-muted-foreground mt-0.5 text-xs'>
                  {n.description}
                </p>
              </div>
              <Switch
                checked={n.enabled}
                onCheckedChange={() =>
                  setNotifications((prev) =>
                    prev.map((item) =>
                      item.id === n.id
                        ? { ...item, enabled: !item.enabled }
                        : item,
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
