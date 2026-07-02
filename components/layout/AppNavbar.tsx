'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useGetProfileInfoQuery } from '@/store/api/endpoints/common/ProfileSettings/ProfileApi';
import { UserRole } from '@/types/next-auth';
import { Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ThemeToggle } from '../ui/theme-toggle';

const AppNavbar: React.FC = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);

  const getProfilePath = () => {
    if (userRole === 'SUPER_ADMIN') {
      return '/super-admin/profile';
    }
    return '/client/profile-settings';
  };

  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur'>
      <SidebarTrigger className='-ml-1 shrink-0' />

      <div className='flex flex-1 items-center justify-end gap-4'>
        <div className='flex items-center gap-2'>
          <ThemeToggle />

          <Button
            variant='ghost'
            size='icon-sm'
            aria-label='Notifications'
            className='border border-gray-200 dark:border-gray-700'
          >
            <Bell />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
