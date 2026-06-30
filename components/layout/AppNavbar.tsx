'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useGetProfileInfoQuery } from '@/store/api/endpoints/common/ProfileSettings/ProfileApi';
import { UserRole } from '@/types/next-auth';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { Bell, LogOut, Search, User, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import Loading from '../common/CustomLoader/Loading';
import { handleSignOut } from '../SignOut';
import { Input } from '../ui/input';
import { ThemeToggle } from '../ui/theme-toggle';

const AppNavbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
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
      {/* Sidebar trigger — hidden when mobile search is open */}
      {!searchOpen && <SidebarTrigger className='-ml-1 shrink-0' />}

      {/* Mobile search overlay */}
      {searchOpen ? (
        <div className='flex flex-1 items-center gap-2'>
          <Input
            type='text'
            autoFocus
            className='h-9! flex-1'
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
              className='h-9! min-w-sm'
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
                    {isLoading ? (
                      <AvatarFallback className='bg-muted flex items-center justify-center'>
                        <Loading />
                      </AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage
                          src={profileData?.profile_image ?? undefined}
                          alt='User profile picture'
                        />
                        <AvatarFallback className='bg-primary text-xs text-white'>
                          {getInitials(profileData?.first_name) ?? 'U'}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                  <div className='flex flex-col gap-1'>
                    <span className='font-medium'>
                      {formatChoiceFieldValue(profileData?.title) ?? ''}{' '}
                      {profileData?.first_name} {profileData?.middle_name}{' '}
                      {profileData?.last_name}
                    </span>
                    <span className='text-muted-foreground text-xs font-normal'>
                      {profileData?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={getProfilePath()} passHref>
                  <DropdownMenuItem className='cursor-pointer'>
                    <User className='size-4' />
                    {userRole === 'SUPER_ADMIN'
                      ? 'Profile'
                      : 'Profile Settings'}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant='destructive'
                  onClick={() => handleSignOut()}
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
