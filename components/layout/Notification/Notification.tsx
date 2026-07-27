'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useAllReadNotificationMutation,
  useGetNotificationsQuery,
  useReadNotificationMutation,
} from '@/store/api/endpoints/common/Notification/NotificationApi';
import { NotificationItem } from '@/types/common/Notification/NotificationTypes';
import { formatDateAndTime } from '@/utils/formatters';
import { getNotificationURL } from '@/utils/redirectPath';
import { Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

// Replace with real data (API call / context / react-query etc.)
const notificationsData = [
  {
    id: '1',
    title: 'New tenant application',
    description: 'John Doe applied for Unit 4B.',
    is_read: false,
    created_at: '2023-04-01T10:00:00Z',
    data: {
      type: 'SUPPORT_TICKET',
      alias: '810252c0-08af-4fc2-af27-812f38fb51ea',
    },
  },
  {
    id: '2',
    title: 'Rent payment received',
    description: 'Payment of $1,200 received from Unit 2A.',
    is_read: true,
    created_at: '2023-04-01T10:00:00Z',
    data: {
      type: 'SUPPORT_TICKET',
      alias: '87ed468d-ce47-4d73-8ba7-a7f41c785c75',
    },
  },
  {
    id: '3',
    title: 'Rent payment received',
    description: 'Payment of $1,200 received from Unit 2A.',
    is_read: false,
    created_at: '2023-04-01T10:00:00Z',
    data: {
      type: 'SUPPORT_TICKET',
      alias: '87ed468d-ce47-4d73-8ba7-a7f41c785c75',
    },
  },
  {
    id: '4',
    title: 'Rent payment received',
    description: 'Payment of $1,200 received from Unit 2A.',
    is_read: true,
    created_at: '2023-04-01T10:00:00Z',
    data: {
      type: 'SUPPORT_TICKET',
      alias: '87ed468d-ce47-4d73-8ba7-a7f41c785c75',
    },
  },
  {
    id: '5',
    title: 'Rent payment received',
    description: 'Payment of $1,200 received from Unit 2A.',
    is_read: true,
    created_at: '2023-04-01T10:00:00Z',
    data: {
      type: 'SUPPORT_TICKET',
      alias: '87ed468d-ce47-4d73-8ba7-a7f41c785c75',
    },
  },
  {
    id: '6',
    title: 'Rent payment received',
    description: 'Payment of $1,200 received from Unit 2A.',
    is_read: true,
    created_at: '2023-04-01T10:00:00Z',
    data: {
      type: 'SUPPORT_TICKET',
      alias: '87ed468d-ce47-4d73-8ba7-a7f41c785c75',
    },
  },
];

const Notification: React.FC = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  //   RTK Hooks
  const { data: notifications, isLoading } =
    useGetNotificationsQuery(undefined);
  const [readNotification, { isLoading: isReadLoading }] =
    useReadNotificationMutation();
  const [allReadNotification, { isLoading: isAllReadLoading }] =
    useAllReadNotificationMutation();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await readNotification(notificationId).unwrap();
      setOpen(false);
    } catch (error) {
      toast.error(`Failed to mark notification as read: ${error}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await allReadNotification(undefined).unwrap();
    } catch (error) {
      toast.error(`Failed to mark all notifications as read: ${error}`);
    }
  };

  const unreadCount = notificationsData.filter((n) => !n.is_read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Notifications'
          className='relative overflow-visible border border-gray-200 dark:border-gray-700'
        >
          <Bell className='size-4' />
          {unreadCount > 0 && (
            <span className='ring-background absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none font-medium text-white ring-2'>
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align='end' className='w-80 p-0'>
        <div className='flex items-center justify-between border-b px-4 py-2'>
          <span className='text-primary flex items-center gap-1 font-semibold'>
            <Bell size={16} />
            Notifications
          </span>
          {unreadCount > 0 && (
            <Button
              variant='link'
              size='sm'
              onClick={handleMarkAllAsRead}
              disabled={isAllReadLoading}
              className='text-muted-foreground text-xs hover:underline'
            >
              {isAllReadLoading ? 'Marking...' : 'Mark all as read'}
              Mark all as read
            </Button>
          )}
        </div>

        <div className='max-h-80 overflow-y-auto'>
          {notificationsData.length === 0 ? (
            <p className='text-muted-foreground px-4 py-6 text-center text-sm'>
              No notifications
            </p>
          ) : (
            notificationsData.map((notification: NotificationItem) => (
              <Link
                href={getNotificationURL(session, notification.data)}
                key={notification.id}
                onClick={handleMarkAsRead.bind(null, notification.id)}
                className={`hover:bg-muted/50 flex items-start gap-2 border-b px-4 py-3 last:border-b-0 ${
                  !notification.is_read ? 'bg-muted/30' : ''
                }`}
              >
                {!notification.is_read && (
                  <span className='bg-warning mt-1.5 h-2 w-2 shrink-0 rounded-full' />
                )}
                <div className={notification.is_read ? 'pl-4' : ''}>
                  <p
                    className={`text-sm font-medium ${
                      !notification.is_read ? 'text-warning' : 'text-foreground'
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {notification.description}
                  </p>
                  {notification.created_at && (
                    <p className='text-muted-foreground/70 mt-1 text-[11px]'>
                      {formatDateAndTime(notification.created_at)}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
