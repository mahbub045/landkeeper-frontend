'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

import { useGetProfileInfoQuery } from '@/store/api/endpoints/common/ProfileSettings/ProfileApi';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import Notification from './Notification/Notification';

const AppNavbar: React.FC = () => {
  const { data: session } = useSession();
  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);
  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur'>
      <SidebarTrigger className='-ml-1 shrink-0' />

      <div className='flex flex-1 items-center justify-center overflow-hidden px-1'>
        {profileData?.subscription_status === 'TRIALING' && (
          <Badge
            variant='destructive'
            className='truncate text-xs whitespace-nowrap'
          >
            {profileData?.trial_days_left ?? 0} days left in trial
          </Badge>
        )}
      </div>

      <div className='flex items-center justify-end gap-2 sm:gap-4'>
        <div className='flex items-center gap-1 sm:gap-2'>
          <ThemeToggle />
          <Notification />

          <Button
            variant='default'
            size='sm'
            className='border border-gray-200 px-2.5 sm:px-4 dark:border-gray-700'
          >
            <Plus />
            <span className='hidden sm:inline'>Join Our Referral Program</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
