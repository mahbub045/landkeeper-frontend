'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import Notification from './Notification/Notification';

const AppNavbar: React.FC = () => {
  const { data: session } = useSession();
  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur'>
      <SidebarTrigger className='-ml-1 shrink-0' />

      <div className='flex flex-1 items-center justify-end gap-4'>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <Notification />
          {/* {session?.user.role !== 'LANDLORD' && (
            <Button
              variant='default'
              size='sm'
              className='rounded-full border border-gray-200 dark:border-gray-700'
            >
              <Plus />
              Join Our Referral Program
            </Button>
          )} */}
          <Button
            variant='default'
            size='sm'
            className='rounded-full border border-gray-200 dark:border-gray-700'
          >
            <Plus />
            Join Our Referral Program
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
