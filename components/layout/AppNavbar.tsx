'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, LogOut, Search, User, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Input } from '../ui/input';
import { ThemeToggle } from '../ui/theme-toggle';

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  return email?.slice(0, 2).toUpperCase() ?? 'LK';
}

const AppNavbar: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur'>
      {/* Sidebar trigger — hidden when mobile search is open */}
      {!searchOpen && <SidebarTrigger className='-ml-1 shrink-0' />}

      {/* Mobile search overlay */}
      {searchOpen ? (
        <div className='flex flex-1 items-center gap-2'>
          <Input
            type='text'
            autoFocus
            className='flex-1'
            placeholder='Search properties, tenants, or documents...'
          />
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label='Close search'
            onClick={() => setSearchOpen(false)}
          >
            <X className='size-4' />
          </Button>
        </div>
      ) : (
        <div className='flex flex-1 items-center justify-between gap-4'>
          {/* Desktop search — hidden on mobile */}
          <div className='hidden sm:block'>
            <Input
              type='text'
              className='min-w-sm'
              placeholder='Search properties, tenants, or documents...'
            />
          </div>

          {/* Spacer on mobile so actions go to the right */}
          <div className='flex-1 sm:hidden' />

          <div className='flex items-center gap-2'>
            {/* Mobile search icon — visible only on mobile */}
            <Button
              variant='ghost'
              size='icon-sm'
              aria-label='Open search'
              className='border border-gray-200 sm:hidden dark:border-gray-700'
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>

            <ThemeToggle />

            <Button
              variant='ghost'
              size='icon-sm'
              aria-label='Notifications'
              className='border border-gray-200 dark:border-gray-700'
            >
              <Bell />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon-sm'
                  aria-label='User menu'
                  className='relative rounded-full p-0'
                >
                  <Avatar size='sm'>
                    <AvatarFallback className='bg-primary text-xs text-white'>
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                  <div className='flex flex-col gap-1'>
                    <span className='font-medium'>{user?.name ?? 'User'}</span>
                    <span className='text-muted-foreground text-xs font-normal'>
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer'>
                  <User className='size-4' />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant='destructive'
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className='cursor-pointer'
                >
                  <LogOut className='size-4' />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;
