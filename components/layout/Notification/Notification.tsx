'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PAGE_LIMIT } from '@/data/common/PaginationData';
import {
  useAllReadNotificationMutation,
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useUnreadNotificationCountQuery,
} from '@/store/api/endpoints/common/Notification/NotificationApi';
import { NotificationItem } from '@/types/common/Notification/NotificationTypes';
import { formatDateAndTime } from '@/utils/formatters';
import { getNotificationURL } from '@/utils/redirectPath';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const getWsBaseUrl = (apiUrl: string | undefined): string => {
  if (!apiUrl) return '';
  return apiUrl.replace(/^http/, 'ws').replace(/\/api\/?$/, '');
};

const WS_BASE_URL = getWsBaseUrl(process.env.NEXT_PUBLIC_API_URL);
const RECONNECT_DELAY_MS = 3000;

const Notification: React.FC = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  //   RTK Hooks
  const {
    data: notificationsData,
    isLoading,
    isFetching,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery({ page, limit: PAGE_LIMIT });
  const {
    data: unreadCountData,
    isLoading: isUnreadCountLoading,
    refetch: refetchUnreadCount,
  } = useUnreadNotificationCountQuery(undefined);
  const [readNotification, { isLoading: isReadLoading }] =
    useReadNotificationMutation();
  const [allReadNotification, { isLoading: isAllReadLoading }] =
    useAllReadNotificationMutation();

  const accessToken = session?.user?.accessToken;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setPage(1);
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    let isUnmounted = false;

    const connect = () => {
      const ws = new WebSocket(
        `${WS_BASE_URL}/ws/notifications/?token=${accessToken}`,
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.debug('Notification WS connected');
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.type === 'notification' || payload) {
            refetchNotifications();
            refetchUnreadCount();
          }
        } catch (error) {
          console.error('Failed to parse notification WS message', error);
        }
      };

      ws.onerror = (event) => {
        console.error('Notification WS error', event);
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (!isUnmounted) {
          reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [accessToken, refetchNotifications, refetchUnreadCount]);

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

  const unreadCount = unreadCountData?.unread_count || 0;

  const hasNext = Boolean(notificationsData?.next);
  const hasPrevious = Boolean(notificationsData?.previous);
  const totalCount = notificationsData?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  const handlePrevious = () => {
    if (hasPrevious) setPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    if (hasNext) setPage((p) => p + 1);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Notifications'
          className='relative overflow-visible border border-gray-200 dark:border-gray-700'
        >
          <Bell className='size-4' />
          {isUnreadCountLoading ? (
            <Loading className='text-danger! absolute -top-1.5 -right-1.5 h-2 w-2' />
          ) : (
            unreadCount > 0 && (
              <span className='ring-background absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none font-medium text-white ring-2'>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )
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
              {isAllReadLoading && (
                <Loading className='text-muted-foreground!' />
              )}
              Mark all as read
            </Button>
          )}
        </div>

        <div className='max-h-80 overflow-y-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center px-4 py-10'>
              <Loading />
            </div>
          ) : notificationsData?.results.length === 0 ? (
            <p className='text-muted-foreground px-4 py-6 text-center text-sm'>
              No notifications
            </p>
          ) : (
            notificationsData?.results.map((notification: NotificationItem) => (
              <Link
                href={getNotificationURL(session, notification.data)}
                key={notification.id}
                onClick={handleMarkAsRead.bind(null, notification.id)}
                aria-disabled={isReadLoading}
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

        {!isLoading && totalCount > 0 && (
          <div className='flex items-center justify-between border-t px-4 py-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handlePrevious}
              disabled={!hasPrevious || isFetching}
              className='text-muted-foreground h-7 px-2 text-xs'
            >
              <ChevronLeft className='mr-1 size-3.5' />
              Previous
            </Button>
            <span className='text-muted-foreground text-xs'>
              Page {page} of {totalPages}
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleNext}
              disabled={!hasNext || isFetching}
              className='text-muted-foreground h-7 px-2 text-xs'
            >
              Next
              <ChevronRight className='ml-1 size-3.5' />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
